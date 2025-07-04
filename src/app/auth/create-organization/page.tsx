"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  organizationSchema,
  type OrganizationFormData,
} from "@/lib/validator";
import LogoUploadField from "@/components/ui/LogoUpload";
import {toast} from "react-toastify";

const formFields = [
  {
    name: "Enter Your Organization Name",
    placeholder: "Organization Name",
    type: "text",
    description: "Maximum of 128 characters.",
    max: 128,
    key: "organizationName" as keyof OrganizationFormData,
  },
  {
    name: "Enter Your Organization Website",
    placeholder: "https://example.com",
    type: "text",
    description: "Optional - Enter a valid URL",
    max: 128,
    key: "organizationWebsite" as keyof OrganizationFormData,
  },
  {
    name: "Logo",
    placeholder: "Upload the logo of your organization",
    type: "file",
    description:
      "The image file should be JPEG or PNG, and less than 2 MB. A size of 480 x 480 px is recommended.",
    key: "logo" as keyof OrganizationFormData,
  },
  {
    name: "Custom URL",
    placeholder: "my-organization",
    type: "text",
    description:
      "Maximum of 128 characters. Only letters, numbers, hyphens, and underscores allowed.",
    key: "customUrl" as keyof OrganizationFormData,
  },
  {
    name: "Location",
    placeholder: "Enter the location of your organization.",
    type: "text",
    description: "Maximum of 32 characters.",
    max: 32,
    key: "location" as keyof OrganizationFormData,
  },
  {
    name: "Tagline",
    placeholder: "Enter a concise description of your organization's vision.",
    type: "text",
    description: "Maximum of 200 characters.",
    max: 200,
    key: "tagline" as keyof OrganizationFormData,
  },
  {
    name: "About",
    placeholder: "Provide more information about your organization.",
    type: "textArea",
    description: "Maximum of 5000 characters.",
    max: 5000,
    key: "about" as keyof OrganizationFormData,
  },
];

export default function Page() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
  });

  const onSubmit = async (data: OrganizationFormData) => {
    setIsSubmitting(true);
    setError(false);
    try {
      const formData = new FormData();

      // Append all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/organization/create`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (result.success) {
        toast.success("Form submitted successfully!");
        reset();
      } else {
        toast.error("Failed to submit form. Please try again.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setError(true);
      toast.error("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="w-[950px] mx-auto bg-white shadow p-2 text-[#212121]">
          <h1 className="font-[500] text-2xl ml-49 mt-3 py-4">Create a new organization</h1>
        <div className="max-w-[945px] mx-auto flex flex-col items-center">

          <form onSubmit={handleSubmit(onSubmit)} className="relative pb-10">
            <div className="m-5 space-y-4">
              {formFields.map((field, index) => (
                <div key={index} className="flex flex-col">
                  <label
                    className={`${
                      field.name !== "Logo" ? "text-sm" : "text-base"
                    } font-semibold mb-1`}
                  >
                    {field.name}
                  </label>

                  {field.type === "file" ? (
                    <LogoUploadField
                      placeholder={field.placeholder}
                      description={field.description}
                      register={register}
                      error={errors[field.key]}
                      onChange={(file) => setValue(field.key, file as any)}
                    />
                  ) : field.type === "text" ? (
                    <>
                      <input
                        {...register(field.key)}
                        type="text"
                        placeholder={field.placeholder}
                        className={`border placeholder:text-sm p-1 rounded ${
                          errors[field.key]
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        maxLength={field?.max}
                      />
                      {errors[field.key] && (
                        <span className="text-xs text-red-500 mt-1">
                          {errors[field.key]?.message}
                        </span>
                      )}
                      {!errors[field.key] && field.description && (
                        <span className="text-xs text-gray-500 mt-1">
                          {field.description}
                        </span>
                      )}
                    </>
                  ) : (
                    <>
                      <textarea
                        {...register(field.key)}
                        placeholder={field.placeholder}
                        className={`border placeholder:text-sm p-1 rounded ${
                          errors[field.key]
                            ? "border-red-300"
                            : "border-gray-300"
                        }`}
                        maxLength={field?.max}
                        rows={5}
                      />
                      {errors[field.key] && (
                        <span className="text-xs text-red-500 mt-1">
                          {errors[field.key]?.message}
                        </span>
                      )}
                      {!errors[field.key] && field.description && (
                        <span className="text-xs text-gray-500 mt-1">
                          {field.description}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3D3ACE] text-white px-4 py-2 rounded transition text-center absolute right-5 bottom-1 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}