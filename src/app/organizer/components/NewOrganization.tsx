"use client";
import React, { useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";
import useOrganizer from "@/hooks/useOrganizers";
import { useQueryClient } from "@tanstack/react-query";

interface CreateOrgProps {
  onClose: () => void;
  type: "new" | "edit";
  existingData?: {
    id: string;
    name: string;
    description: string;
  };
}

function NewOrganization({ onClose, type, existingData }: CreateOrgProps) {
  const [formData, setFormData] = useState({
    name: existingData?.name || "",
    description: existingData?.description || "",
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const queryClient = useQueryClient();
  const { createOrganization, updateOrganization } = useOrganizer();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "name" && value.length > 25) return;
    if (name === "description" && value.length > 350) return;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (type === "new") {
        await createOrganization.mutateAsync({
          name: formData.name,
          description: formData.description,
        });
      } else if (type === "edit" && existingData?.id) {
        await updateOrganization.mutateAsync({
          id: existingData.id,
          data: {
            name: formData.name,
            description: formData.description,
          },
        });
      }

      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({
        queryKey: ["organization_byId", existingData?.id],
      });

      setStatus("success");
    } catch (err) {
      console.error("Error submitting organization:", err);
      setStatus("error");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/30 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white backdrop-blur-lg border border-white/40 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-[#171717] text-2xl font-semibold">
            {type === "new" ? "New Organization" : "Edit Organization"}
          </h1>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        {status === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-4 text-start">
            {/* Name Field */}
            <div className="space-y-1 flex flex-col">
              <label
                htmlFor="name"
                className="text-[#212121] font-medium text-sm"
              >
                Organization Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter organization name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.name.length}/25
              </div>
            </div>

            <div className="space-y-1 flex flex-col">
              <label
                htmlFor="description"
                className="text-[#212121] font-medium text-sm"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Company's description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border rounded-xl px-4 py-3 outline-none resize-none h-24 focus:ring-2 focus:ring-indigo-500"
              />
              <div className="text-xs text-gray-500 text-right">
                {formData.description.length}/350
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
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
          </form>
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
              We couldn’t {type === "new" ? "create" : "update"} your
              organization. Please try again later.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      {/* Animations */}
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
