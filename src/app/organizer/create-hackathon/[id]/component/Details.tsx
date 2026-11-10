"use client";

import React, { useState } from "react";
import { FileImageIcon } from "lucide-react";
import { NavigationProps } from "@/components/Interface";
import { useHackathonStore } from "@/store/useHackathonStore";
import { useShallow } from "zustand/shallow";
import RuleInput from "./RuleInput";
import { FieldError, FieldLabel, errorRing, useFieldError } from "./FormField";
import { isRichTextEmpty } from "../validation";
import dynamic from "next/dynamic";
import {
  MAX_IMAGE_UPLOAD_BYTES,
  MAX_IMAGE_UPLOAD_LABEL,
  uploadToCloudinary,
} from "@/lib/uploadToCloudinary";

const TiptapEditor = dynamic(() => import("@/components/ui/TipTapEditor"), {
  ssr: false,
});

function Details({ onNext }: NavigationProps) {
  const {
    title,
    description,
    start_date,
    end_date,
    rules,
    banner_image_file,
    banner_uploading,
    preview,
    setField,
  } = useHackathonStore(
    useShallow((state) => ({
      title: state.title,
      description: state.description,
      start_date: state.start_date,
      end_date: state.end_date,
      rules: state.rules,
      banner_image_file: state.banner_image_file,
      banner_uploading: state.banner_uploading,
      preview: state.preview,
      setField: state.setField,
    }))
  );

  const titleErr = useFieldError("title");
  const startErr = useFieldError("start_date");
  const endErr = useFieldError("end_date");
  const bannerErr = useFieldError("banner_image_file");
  const descErr = useFieldError("description");
  const rulesErr = useFieldError("rules");
  const [uploadError, setUploadError] = useState("");

  // While uploading show the local preview; afterwards show the uploaded URL
  // (a persisted blob: URL from a previous session would be a broken image).
  const shownBanner = banner_uploading ? preview : banner_image_file;

  const handleContinue = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onNext?.();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-selecting the same file after a failure
    if (!file) return;
    setUploadError("");
    bannerErr.clear();

    if (!file.type.startsWith("image/")) {
      setUploadError("Banner must be an image file (PNG, JPG, GIF or WebP).");
      return;
    }

    if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
      setUploadError(`Banner image must be ${MAX_IMAGE_UPLOAD_LABEL} or smaller.`);
      return;
    }

    setField("preview", URL.createObjectURL(file));
    setField("banner_uploading", true);

    try {
      const imageUrl = await uploadToCloudinary(file);
      setField("banner_image_file", imageUrl);
    } catch (err: any) {
      console.error("[create-hackathon] banner upload failed", err);
      setField("banner_image_file", null);
      setUploadError(
        `Banner upload failed${err?.message ? `: ${err.message}` : ""}. Please try again, or continue without a banner.`
      );
    } finally {
      setField("preview", null);
      setField("banner_uploading", false);
    }
  };

  const removeBanner = () => {
    setField("banner_image_file", null);
    setUploadError("");
  };

  const inputBase =
    "w-full rounded-xl py-3 px-4 border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/5 focus:ring-2 focus:ring-[#0B40EE] outline-none";

  return (
    <>
   <form onSubmit={handleContinue} className="max-w-4xl mx-auto space-y-8">
  {/* Section: Basic Info */}
  <div className="space-y-6">
    <div>
      <FieldLabel htmlFor="title" required>Hackathon Name</FieldLabel>
      <input
        id="title"
        type="text"
        aria-invalid={!!titleErr.error}
        placeholder="e.g. Global Web3 Buildathon"
        value={title}
        onChange={(e) => {
          setField("title", e.target.value);
          titleErr.clear();
        }}
        name="title"
        maxLength={100}
        className={`${inputBase} mt-2 focus:bg-white dark:focus:bg-transparent focus:border-transparent transition-all ${errorRing(!!titleErr.error)}`}
      />
      <FieldError message={titleErr.error} />
    </div>

    {/* Date Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <FieldLabel htmlFor="start_date" required>Start Date</FieldLabel>
        <input
          id="start_date"
          type="date"
          aria-invalid={!!startErr.error}
          value={start_date}
          onChange={(e) => {
            setField("start_date", e.target.value);
            startErr.clear();
          }}
          className={`${inputBase} cursor-pointer ${errorRing(!!startErr.error)}`}
        />
        <FieldError message={startErr.error} />
      </div>
      <div className="space-y-2">
        <FieldLabel htmlFor="end_date" required>End Date</FieldLabel>
        <input
          id="end_date"
          type="date"
          aria-invalid={!!endErr.error}
          value={end_date} min={start_date || undefined}
          onChange={(e) => {
            setField("end_date", e.target.value);
            endErr.clear();
          }}
          className={`${inputBase} cursor-pointer ${errorRing(!!endErr.error)}`}
        />
        <FieldError message={endErr.error} />
      </div>
    </div>
  </div>

  {/* Section: Visuals */}
  <div>
    <FieldLabel htmlFor="banner-upload">Hackathon Banner</FieldLabel>
    <div className="mt-2">
      <input
        type="file"
        id="banner-upload"
        accept="image/*"
        className="hidden"
        disabled={banner_uploading}
        onChange={handleFileChange}
      />
      <label
        htmlFor="banner-upload"
        className={`group relative flex flex-col items-center justify-center w-full border-2 border-dashed ${uploadError || bannerErr.error ? "border-red-400" : "border-gray-300"} dark:border-gray-700 rounded-2xl p-8 cursor-pointer bg-gray-50/30 dark:bg-white/5 hover:border-[#0B40EE] hover:bg-gray-50 dark:hover:bg-white/10 transition-all min-h-[180px]`}
      >
        {!shownBanner ? (
          <div className="text-center">
            <div className="mx-auto w-12 h-12 mb-4 text-[#0B40EE] bg-[#0B40EE]/10 flex justify-center items-center rounded-xl group-hover:scale-110 transition-transform">
              <FileImageIcon className="text-2xl" />
            </div>
            <p className="text-gray-900 dark:text-white font-medium">Click to upload banner</p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to {MAX_IMAGE_UPLOAD_LABEL}</p>
          </div>
        ) : (
          <div className="relative w-full">
            <img src={shownBanner} alt="Banner preview" className="max-h-60 w-full object-cover rounded-xl" />
            {banner_uploading ? (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center gap-3 rounded-xl">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <p className="text-white text-sm font-medium">Uploading...</p>
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                <p className="text-white text-sm font-medium">Change Image</p>
              </div>
            )}
          </div>
        )}
      </label>
      {banner_image_file && !banner_uploading && (
        <button
          type="button"
          onClick={removeBanner}
          className="mt-2 text-sm text-gray-500 hover:text-red-600 underline-offset-2 hover:underline"
        >
          Remove banner
        </button>
      )}
      <FieldError message={uploadError || bannerErr.error} />
    </div>
  </div>

  {/* Section: Content Editor */}
  <div className="grid gap-8">
    <div className="space-y-2">
      <FieldLabel required>Description</FieldLabel>
      <div className={`rounded-xl border overflow-hidden focus-within:ring-2 focus-within:ring-[#0B40EE] ${descErr.error ? "border-red-500" : "border-gray-200 dark:border-gray-700"}`}>
        <TiptapEditor
          value={description ?? ""}
          onChange={(html) => {
            setField("description", html);
            if (!isRichTextEmpty(html)) descErr.clear();
          }}
        />
      </div>
      <FieldError message={descErr.error} />
    </div>

    <div className="space-y-2">
      <FieldLabel>Rules & Guidelines</FieldLabel>
      <RuleInput
        rule={rules ?? ""}
        setRule={(newRules: string) => {
          setField("rules", newRules);
          rulesErr.clear();
        }}
      />
      <FieldError message={rulesErr.error} />
    </div>
  </div>

  {/* Footer Action */}
  <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-end">
    <button
      type="submit"
      disabled={banner_uploading}
      className="disabled:opacity-60 disabled:cursor-not-allowed bg-[#0B40EE] hover:bg-[#0835C4] text-white font-bold py-3 px-10 rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95 cursor-pointer"
    >
      Continue to Next Step
    </button>
  </div>
</form>
    </>
  );
}

export default Details;
