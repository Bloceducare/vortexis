"use client";

import React, { useState, DragEvent } from "react";
import { FileImageIcon } from "lucide-react";
import { NavigationProps } from "@/components/Interface";
import { toast } from "react-toastify";
import { useHackathonStore } from "@/store/useHackathonStore";
import { useShallow } from "zustand/shallow";
import RuleInput from "./RuleInput";
import dynamic from "next/dynamic";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";

const TiptapEditor = dynamic(() => import("@/components/ui/TipTapEditor"), {
  ssr: false,
});

function Details({ onNext, data }: NavigationProps) {

  const hackathonSelector = useShallow((state: any) => ({
    title: state.title,
    preview: state.preview,
    description: state.description,
    evaluation_criteria: state.evaluation_criteria,
    start_date: state.start_date,
    end_date: state.end_date,
    rules: state.rules,
   banner_image_file: state.banner_image_file, 

    setField: state.setField,
    setPreview: state.setPreview,
  }));

  const {
    title,
    description,
    evaluation_criteria,
    start_date,
    end_date,
    rules,
    banner_image_file,
    
    preview,
    setField,
  } = useHackathonStore(hackathonSelector);

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (description === "") {
      toast.error("Please enter a description", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    if (start_date === "") {
      toast.error("Please enter a start date", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    if (end_date === "") {
      toast.error("Please enter an ending date", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    if (title === "") {
      toast.error("Please enter a title for the hackathon", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (start >= end) {
      toast.error("Start date must be before the end date", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      return;
    }
    if (onNext) {
      onNext();
    }
  };


const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;

  const previewUrl = URL.createObjectURL(file);
  setField("preview", previewUrl);

  try {
    const imageUrl = await uploadToCloudinary(file);

   
    setField("banner_image_file", imageUrl);
  } catch (err) {
    console.error("Upload failed", err);
    setField("preview", null);
    setField("banner_image_file", null);
  }
};


  return (
    <>
   <form onSubmit={handleContinue} className="max-w-4xl mx-auto space-y-8">
  {/* Section: Basic Info */}
  <div className="space-y-6">
    <div>
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
        Hackathon Name
      </label>
      <input
        type="text"
        placeholder="e.g. Global Web3 Buildathon"
        value={title}
        onChange={(e) => setField("title", e.target.value)}
        name="title"
        maxLength={80}
        className="w-full mt-2 rounded-xl py-3 px-4 border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 focus:bg-white dark:focus:bg-transparent focus:ring-2 focus:ring-[#0B40EE] focus:border-transparent outline-none transition-all"
      />
    </div>

    {/* Date Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
          Start Date
        </label>
        <input
          type="date"
          value={start_date}
          onChange={(e) => setField("start_date", e.target.value)}
          className="w-full rounded-xl py-3 px-4 border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 focus:ring-2 focus:ring-[#0B40EE] outline-none cursor-pointer"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
          End Date
        </label>
        <input
          type="date"
          value={end_date}
          onChange={(e) => setField("end_date", e.target.value)}
          className="w-full rounded-xl py-3 px-4 border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 focus:ring-2 focus:ring-[#0B40EE] outline-none cursor-pointer"
        />
      </div>
    </div>
  </div>

  {/* Section: Visuals */}
  <div>
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">
      Hackathon Banner
    </label>
    <div className="mt-2">
      <input
        type="file"
        id="banner-upload"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
      <label
        htmlFor="banner-upload"
        className="group relative flex flex-col items-center justify-center w-full border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 cursor-pointer bg-gray-50/30 dark:bg-white/5 hover:border-[#0B40EE] hover:bg-gray-50 dark:hover:bg-white/10 transition-all min-h-[180px]"
      >
        {!preview ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4 text-[#0B40EE] bg-[#0B40EE]/10 flex justify-center items-center rounded-xl group-hover:scale-110 transition-transform">
              <FileImageIcon className="text-2xl" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium">Click to upload banner</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
          </div>
        ) : (
          <div className="relative w-full">
            <img src={preview} alt="Preview" className="max-h-60 w-full object-cover rounded-xl" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
               <p className="text-white text-sm font-medium">Change Image</p>
            </div>
          </div>
        )}
      </label>
    </div>
  </div>

  {/* Section: Content Editor */}
  <div className="grid gap-8">
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Description</label>
      <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden focus-within:ring-2 focus-within:ring-[#0B40EE]">
        <TiptapEditor value={description} onChange={(html) => setField("description", html)} />
      </div>
    </div>

    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider">Rules & Guidelines</label>
      <RuleInput rule={rules} setRule={(newRules: any) => setField("rules", newRules)} />
    </div>
  </div>

  {/* Footer Action */}
  <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
    <button
      type="submit"
      className="bg-[#0B40EE] hover:bg-[#0835C4] text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
    >
      Continue to Next Step
    </button>
  </div>
</form>
    </>
  );
}

export default Details;
