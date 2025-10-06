"use client";
import React, { useState } from "react";
import { X, CheckCircle, AlertCircle } from "lucide-react";

interface CreateOrgProps {
  onClose: () => void;
}

function NewOrganization({ onClose }: CreateOrgProps) {
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    field: "",
    country: "",
    website: "",
    twitter: "",
    linkedin: "",
    facebook: "",
    description: "",
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStatus("success");
    } catch {
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
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-[#171717] text-2xl font-semibold">New Organization</h1>


        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition cursor-pointer" 
        >
          <X size={20} />
        </button>
      </div>
       

        {status === "idle" && (
          <>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-start">
  {/* Organization Name */}
  <div className="space-y-2 flex flex-col">
    <label htmlFor="name" className="text-[#212121] font-medium text-sm">
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
  </div>

  {/* Tagline */}
   <div className="space-y-2 flex flex-col">
    <label htmlFor="tagline" className="text-[#212121] font-medium text-sm">
      Tagline
    </label>
    <input
      id="tagline"
      type="text"
      name="tagline"
      placeholder="Enter a short tagline"
      value={formData.tagline}
      onChange={handleChange}
      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Field & Country */}
  <div className="flex gap-3">
    <div className="w-1/2 space-y-2">
      <label htmlFor="field" className="text-[#212121] font-medium text-sm">
        Field
      </label>
      <input
        id="field"
        type="text"
        name="field"
        placeholder="Organization field"
        value={formData.field}
        onChange={handleChange}
        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
    <div className="w-1/2 space-y-2">
      <label htmlFor="country" className="text-[#212121] font-medium text-sm">
        Country
      </label>
      <input
        id="country"
        type="text"
        name="country"
        placeholder="Country"
        value={formData.country}
        onChange={handleChange}
        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>

  {/* Website */}
   <div className="space-y-2 flex flex-col">
    <label htmlFor="website" className="text-[#212121] font-medium text-sm">
      Website
    </label>
    <input
      id="website"
      type="text"
      name="website"
      placeholder="Website"
      value={formData.website}
      onChange={handleChange}
      className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
    />
  </div>

  {/* Social Media */}
   <div className="space-y-2 flex flex-col">
    <label className="text-[#212121] font-medium text-sm">Social Media</label>
    <div className="flex gap-2 mt-1">
      <input
        type="text"
        name="twitter"
        placeholder="Twitter link"
        value={formData.twitter}
        onChange={handleChange}
        className="w-1/3 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="text"
        name="linkedin"
        placeholder="LinkedIn link"
        value={formData.linkedin}
        onChange={handleChange}
        className="w-1/3 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
      />
      <input
        type="text"
        name="facebook"
        placeholder="Facebook link"
        value={formData.facebook}
        onChange={handleChange}
        className="w-1/3 border rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  </div>

  {/* Description */}
   <div className="space-y-2 flex flex-col">
    <label htmlFor="description" className="text-[#212121] font-medium text-sm">
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
  </div>

  <div className="flex justify-end">
  <button
    type="submit"
    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all cursor-pointer"
  >
    Create organization
  </button>
</div>


  
</form>

          </>
        )}

      
        {status === "success" && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
            <CheckCircle className="text-green-500 w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Organization Created!
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              Your organization has been created successfully. Please keep in
              touch and wait for it to be approved by our team.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all"
            >
              Done
            </button>
          </div>
        )}

     
        {status === "error" && (
          <div className="flex flex-col items-center justify-center py-12 text-center animate-fadeIn">
            <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800">
              Something went wrong
            </h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              We couldn’t create your organization. Please try again later.
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
