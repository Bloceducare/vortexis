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
      <form onSubmit={handleContinue}>
        <div>
          <label className="text-2xl text-[#2F3036] dark:text-white">Hackathon Name</label>
          <input
            type="text"
            placeholder="Enter Hackathon Name"
            value={title}
            onChange={(e) => setField("title", e.target.value)}
            name="title"
            maxLength={80}
            className="w-full rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3"
          />
        </div>

        <div className="flex justify-between mt-10">
          <div className="w-[45%]">
            <label className="text-2xl text-[#2F3036] dark:text-white">Start Date</label>
            <input
              type="date"
              placeholder="Start Date"
              value={start_date}
              onChange={(e) => setField("start_date", e.target.value)}
              name="start_date"
              className="w-full rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3 cursor-pointer"
            />
          </div>

          <div className="w-[45%]">
            <label className="text-2xl text-[#2F3036] dark:text-white">End Date</label>
            <input
              type="date"
              placeholder="End date"
              value={end_date}
              onChange={(e) => setField("end_date", e.target.value)}
              name="end_date"
              className="w-full rounded-2xl py-3 px-3 border outline-none border-[#C5C6CC] mt-3 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-10">
          <label className="text-2xl text-[#2F3036] dark:text-white">Hackathon Banner</label>

          <div className="mt-3">
            <input
              type="file"
              name="banner"
              id="banner-upload"
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
              onChange={handleFileChange}
            />

            <label
              htmlFor="banner-upload"
              className="flex flex-col items-center justify-center text-center gap-3 w-full border border-[#C5C6CC] rounded-2xl px-4 py-8 cursor-pointer bg-[#FAFAFA] dark:bg-[#514343] hover:bg-[#f0f0f0] transition min-h-[200px]"
            >
              {!preview ? (
                <>
                  <div className="text-[#0B40EE] bg-[#0B40EE1A] p-3 flex justify-center items-center rounded-full">
                    <FileImageIcon className="text-3xl" />
                  </div>
                  <div>
                    <p className="text-[#2F3036] dark:text-white font-medium">
                      Click to upload banner
                    </p>
                    <p className="text-sm text-gray-500">
                      Accepts PNG, JPG, JPEG
                    </p>
                  </div>
                </>
              ) : (
                <img
                  src={preview}
                  alt="Banner Preview"
                  className="max-h-48 w-full object-contain rounded-xl"
                />
              )}
            </label>
          </div>
        </div>

        <div className="mt-10">
          <label className="text-2xl text-[#2F3036] dark:text-white">Description</label>
          <div>
            <TiptapEditor
              value={description}
              onChange={(html) => setField("description", html)}
            />
          </div>
        </div>

        <div className="mt-10">
          <label className="text-2xl text-[#2F3036] dark:text-white mb-2 block">
            Rules & Guidelines
          </label>
          <RuleInput
            rule={rules}
            setRule={(newRules: any) => setField("rules", newRules)}
          />
        </div>

        <div className="mt-10">
          <label className="text-2xl text-[#2F3036] dark:text-white">Evaluation Criteria</label>
          <div>
            <TiptapEditor
              value={evaluation_criteria}
              onChange={(html) => setField("evaluation_criteria", html)}
            />
          </div>
        </div>

        <div className="mt-10">
          <button
            className="bg-[#0B40EE] text-white py-2 px-8 rounded cursor-pointer"
            type="submit"
          >
            Next
          </button>
        </div>
      </form>
    </>
  );
}

export default Details;
