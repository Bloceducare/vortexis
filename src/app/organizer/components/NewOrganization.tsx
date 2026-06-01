"use client";
import React, { useState } from "react";
import { X, CheckCircle, AlertCircle, Upload } from "lucide-react";
import useOrganizer from "@/hooks/useOrganizers";
import { useQueryClient } from "@tanstack/react-query";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

interface CreateOrgProps {
  onClose: () => void;
  type: "new" | "edit";
  existingData?: {
    id: string;
    name: string;
    description: string;
    website: string;
    logo_file?: string | null;
    logo?: string | null;
    custom_url: string;
    location: string;
    tagline: string;
    about: string;
  };
}

function NewOrganization({ onClose, type, existingData }: CreateOrgProps) {
  const [formData, setFormData] = useState({
    name: existingData?.name || "",
    description: existingData?.description || "",
    website: existingData?.website || "",
    custom_url: existingData?.custom_url || "",
    location: existingData?.location || "",
    tagline: existingData?.tagline || "",
    about: existingData?.about || "",
  });

  const [logoUrl, setLogoUrl] = useState<string | null>(
    existingData?.logo_file || existingData?.logo || null
  );
  const [isUploading, setIsUploading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(
    existingData?.logo || existingData?.logo_file || null
  );
  const [fileError, setFileError] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  
  const queryClient = useQueryClient();
  const { createOrganization, updateOrganization } = useOrganizer();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name" && value.length > 25) return;
    if (name === "description" && value.length > 350) return;
    if (name === "tagline" && value.length > 100) return;
    if (name === "about" && value.length > 1000) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };


const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  setFileError("");
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    setFileError("Please upload an image file");
    return;
  }

  const MAX_GENERIC_SIZE = 1.2 * 1024 * 1024; // 1.2MB
  if (file.size > MAX_GENERIC_SIZE) {
    setFileError("File size must be less than 1.2MB");
    return;
  }

  setLogoPreview(URL.createObjectURL(file));

  setIsUploading(true);
  try {
    const uploadedUrl = await uploadToCloudinary(file);
    setLogoUrl(uploadedUrl);
  } catch (err) {
    console.error("Upload failed", err);
    setFileError("Failed to upload image");
    setLogoPreview("");
    setLogoUrl(null);
  } finally {
    setIsUploading(false);
  }
};

const handleRemoveLogo = () => {
  setLogoPreview("");
  setLogoUrl(null);
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.name.trim()) return;

  const payload = {
    name: formData.name,
    description: formData.description,
    website: formData.website,
    custom_url: formData.custom_url,
    location: formData.location,
    tagline: formData.tagline,
    about: formData.about,
    logo_file: logoUrl,
  };

    try {
      if (type === "new") {
        const created = await createOrganization.mutateAsync(payload);

        queryClient.setQueryData(["organizations"], (old: any) => {
          if (!old) return [created];
          // If old is an array of orgs
          if (Array.isArray(old)) return [created, ...old];
          // If old is a paginated response { results: [...] }
          if (old && Array.isArray(old.results)) {
            return { ...old, results: [created, ...old.results] };
          }
          // Fallback: return as-is or wrap into array
          return [created, old] as any;
        });

        await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      }

      if (type === "edit") {
        if (!existingData?.id) {
          const msg = "Missing organization id for update.";
          console.error(msg);
          setErrorMessage(msg);
          setStatus("error");
          return;
        }
        console.debug("Updating organization id:", existingData.id);

        if (!existingData.id) {
          const msg = "Invalid organization id.";
          console.error(msg);
          setErrorMessage(msg);
          setStatus("error");
          return;
        }

        // proceed with update when id present
        
        
        
      }

      if (type === "edit" && existingData?.id) {
        console.debug("Calling updateOrganization", { id: String(existingData.id), payload });
        const updated = await updateOrganization.mutateAsync({
          id: String(existingData.id),
          payload: {
            name: formData.name,
            description: formData.description,
            website: formData.website,
            location: formData.location,
            tagline: formData.tagline,
            about: formData.about,
            logo_file: logoUrl,
          },
        });
        console.debug("updateOrganization response", updated);

        queryClient.setQueryData(["organization_byId", existingData.id], updated);

        queryClient.setQueryData(["organizations"], (old: any) => {
          if (!old) return old;
          if (Array.isArray(old)) return old.map((org: any) => (org.id === updated.id ? updated : org));
          if (old && Array.isArray(old.results)) {
            return { ...old, results: old.results.map((org: any) => (org.id === updated.id ? updated : org)) };
          }
          return old;
        });

        await queryClient.invalidateQueries({ queryKey: ["organization_byId", existingData.id] });
        await queryClient.invalidateQueries({ queryKey: ["organizations"] });
      }

      setStatus("success");
    } catch (err: any) {
      console.error("Error submitting organization:", err);
      const apiError =
        err?.response?.data?.non_field_errors?.[0] ||
        err?.response?.data?.message ||
        err?.message ||
        "Failed to submit organization.";
      setErrorMessage(apiError);
      setStatus("error");
    }
};

  const handleClose = () => {
    setStatus("idle");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm animate-fadeIn ">
      <div className="bg-white backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative animate-scaleIn dark:bg-gray-900">
        {/* Header */}
        <div className="flex justify-between items-center mb-5 sticky dark:text-white top-0 bg-white z-10 rounded-md dark:bg-gray-700 p-5 ">
          <h1 className="text-[#171717] dark:text-white text-2xl font-semibold">
            {type === "new" ? "New Organization" : "Edit Organization"}
          </h1>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        {status === "idle" && (
          <div className="space-y-5 text-start">
            {/* Logo Upload */}
        <div className="space-y-2 flex flex-col">
  <label className="text-[#212121] dark:text-white font-medium text-sm">
    Organization Logo
  </label>

  {!logoPreview ? (
    <div className="relative">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id="logo-upload"
      />
      <label
        htmlFor="logo-upload"
        className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/50 transition-all"
      >
        <Upload className="w-10 h-10 text-gray-400 mb-2" />
        <span className="text-sm text-gray-600 font-medium">
          Click to upload logo
        </span>
        <span className="text-xs text-gray-400 mt-1">
          PNG, JPG up to 2MB
        </span>
      </label>
    </div>
  ) : (
    <div className="relative w-40 h-40 border-2 border-gray-200 rounded-xl overflow-hidden group">
      <img
        src={logoPreview}
        alt="Logo preview"
        className="w-full h-full object-cover"
      />
      <button
        type="button"
        onClick={handleRemoveLogo}
        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <X className="text-white w-8 h-8" />
      </button>
      {isUploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-semibold">
          Uploading...
        </div>
      )}
    </div>
  )}

  {fileError && (
    <span className="text-xs text-red-500">{fileError}</span>
  )}
</div>


            {/* Name Field */}
            <div className="space-y-1 flex flex-col">
              <label
                htmlFor="name"
                className="text-[#212121] dark:text-white font-medium text-sm"
              >
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter organization name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 dark:placeholder:text-white/70"
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.name.length}/25
              </div>
            </div>

            {/* Tagline Field */}
            <div className="space-y-1 flex flex-col">
              <label
                htmlFor="tagline"
                className="text-[#212121] dark:text-white font-medium text-sm"
              >
                Tagline
              </label>
              <input
                id="tagline"
                type="text"
                name="tagline"
                placeholder="A short catchy phrase about your organization"
                value={formData.tagline}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500  dark:placeholder:text-white/70"
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.tagline.length}/100
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1 flex flex-col">
              <label
                htmlFor="description"
                className="text-[#212121] dark:text-white font-medium text-sm"
              >
                Short Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Brief description of your organization"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none resize-none h-24 focus:ring-2 focus:ring-indigo-500  dark:placeholder:text-white/70"
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.description.length}/350
              </div>
            </div>

            {/* About */}
            <div className="space-y-1 flex flex-col">
              <label
                htmlFor="about"
                className="text-[#212121] dark:text-white font-medium text-sm"
              >
                About
              </label>
              <textarea
                id="about"
                name="about"
                placeholder="Detailed information about your organization"
                value={formData.about}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none resize-none h-32 focus:ring-2 focus:ring-indigo-500 dark:placeholder:text-white/70"
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.about.length}/1000
              </div>
            </div>

            {/* Website */}
            <div className="space-y-1 flex flex-col">
              <label
                htmlFor="website"
                className="text-[#212121] dark:text-white font-medium text-sm"
              >
                Website
              </label>
              <input
                id="website"
                type="url"
                name="website"
                placeholder="https://example.com"
                value={formData.website}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500  dark:placeholder:text-white/70"
              />
            </div>

            {/* Custom URL */}
            {/* <div className="space-y-1 flex flex-col">
              <label
                htmlFor="custom_url"
                className="text-[#212121] dark:text-white font-medium text-sm"
              >
                Custom URL
              </label>
              <div className="flex items-center border rounded-xl focus-within:ring-2 focus-within:ring-indigo-500">
                <span className="px-4 text-gray-500 text-sm">
                  yoursite.com/
                </span>
                <input
                  id="custom_url"
                  type="text"
                  name="custom_url"
                  placeholder="my-organization"
                  value={formData.custom_url}
                  onChange={handleChange}
                  className="flex-1 py-3 pr-4 outline-none"
                />
              </div>
            </div> */}

            {/* Location */}
            <div className="space-y-1 flex flex-col">
              <label
                htmlFor="location"
                className="text-[#212121] dark:text-white font-medium text-sm"
              >
                Location
              </label>
              <input
                id="location"
                type="text"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500  dark:placeholder:text-white/70"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={
                  (type === "new" && createOrganization.isPending) ||
                  (type === "edit" && updateOrganization.isPending)
                }
                className={`${
                  (type === "new" && createOrganization.isPending) ||
                  (type === "edit" && updateOrganization.isPending)
                    ? "bg-indigo-400 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-700"
                } text-white px-6 py-3 rounded-xl font-medium transition-all cursor-pointer`}
              >
                {type === "new"
                  ? createOrganization.isPending
                    ? "Creating..."
                    : "Create Organization"
                  : updateOrganization.isPending
                  ? "Updating..."
                  : "Update Organization"}
              </button>
            </div>
          </div>
        )}

        {/* Success */}
        {status === "success" && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              {type === "new"
                ? "Organization Created!"
                : "Organization Updated!"}
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              {type === "new"
                ? "Your organization has been created successfully. Please wait for it to be approved by our team."
                : "Your organization details have been updated successfully."}
            </p>
            <button
              onClick={handleClose}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all cursor-pointer"
            >
              Done
            </button>
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
            <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Something went wrong
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              {errorMessage || (
                <>
                  We couldn't {type === "new" ? "create" : "update"} your
                  organization. Please try again later.
                </>
              )}
            </p>
            <button
              onClick={() => {
                setErrorMessage("");
                setStatus("idle");
              }}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease forwards;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease forwards;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default NewOrganization;