"use client";

import type React from "react";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";
import { Upload, X } from "lucide-react";
import type { UseFormRegister, FieldError } from "react-hook-form";
import type { OrganizationFormData } from "@/lib/validator";

interface LogoUploadFieldProps {
  placeholder: string;
  description: string;
  register: UseFormRegister<OrganizationFormData>;
  error?: FieldError;
  onChange: (file: File | null) => void;
}

export default function LogoUploadField({
  placeholder,
  description,
  register,
  error,
  onChange,
}: LogoUploadFieldProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onChange(file);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setPreviewUrl(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div>
      <div
        className={`relative border-2 border-dashed rounded cursor-pointer transition-colors min-h-[120px] flex items-center justify-center
          ${
            dragActive
              ? "border-blue-400 bg-blue-50"
              : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100"
          }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          {...register("logo")}
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept="image/jpeg,image/png"
          onChange={handleChange}
        />

        {previewUrl ? (
          <div className="relative p-4">
            <img
              src={previewUrl || "/placeholder.svg"}
              alt="Logo preview"
              className="max-w-full max-h-20 mx-auto object-contain"
            />
            <button
              type="button"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center text-xs hover:bg-red-600"
              onClick={handleRemove}
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <div className="text-center p-4">
            <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">{placeholder}</p>
          </div>
        )}
      </div>

      {error && (
        <span className="text-xs text-red-500 mt-1 block">{error.message}</span>
      )}
      {!error && description && (
        <span className="text-xs text-gray-500 mt-1 block">{description}</span>
      )}
    </div>
  );
}