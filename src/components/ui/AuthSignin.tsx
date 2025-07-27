"use client";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signInGithubAction, signInGoogleAction } from "@/lib/actions";
import Button from "./AuthButton";
import Divider from "./Divider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSignUpForm } from "@/hooks/useSignup";
import {
  organizerFormFields,
  participantsFormFields,
  type FormField,
} from "@/lib/form-fields";

// Type definitions for form data (needed for FieldPath)
import type { OrganizerFormData, ParticipantFormData } from "@/lib/validator";
import type { FieldPath } from "react-hook-form";

type FormData = OrganizerFormData | ParticipantFormData;

type AuthFormType = "organizers" | "participants";

interface SignUpFormProps {
  type: AuthFormType;
}

export default function SignUpForm({ type }: SignUpFormProps) {
  const {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    toggleShowPassword,
    onSubmit,
  } = useSignUpForm(type); // Use the custom hook

  const formFields: FormField[] =
    type === "organizers" ? organizerFormFields : participantsFormFields;

  return (
    <div className="shadow-md bg-white w-full max-w-[798px] mx-auto h-full rounded-[24px] p-4 md:p-2">
      <h1 className="text-2xl text-center py-4 text-[#2E0BF4] font-[700]">
        {type === "organizers" && "Create Your Organizer Account"}
        {type === "participants" && "Create Your Participant Account"}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-[#2F3036] p-2 w-[95%] mx-auto"
      >
        {formFields.map((field) => (
          <div key={field.name} className="mb-4 relative">
            <label className="block font-[700] text-sm mb-1">
              {field.label}
            </label>

            {!field.eyeView && (
              <div>
                <input
                  {...register(field.name as FieldPath<FormData>)}
                  type={field.type}
                  placeholder={field.placeholder}
                  className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent ${
                    errors[field.name as keyof FormData]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                {errors[field.name as keyof FormData] && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors[field.name as keyof FormData]?.message}
                  </span>
                )}
              </div>
            )}

            {field.eyeView && (
              <div className="relative">
                <input
                  {...register(field.name as FieldPath<FormData>)}
                  type={showPassword[field.name] ? "text" : "password"}
                  placeholder={field.placeholder}
                  className={`w-full p-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent ${
                    errors[field.name as keyof FormData]
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                />
                <div
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                  onClick={() => toggleShowPassword(field.name)}
                >
                  {showPassword[field.name] ? (
                    <EyeOff className="h-4 w-4 text-gray-500" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-500" />
                  )}
                </div>
                {errors[field.name as keyof FormData] && (
                  <span className="text-xs text-red-500 mt-1 block">
                    {errors[field.name as keyof FormData]?.message}
                  </span>
                )}
              </div>
            )}

            {field.description && (
              <span className="text-xs text-gray-500 mt-1 block">
                {field.description}
              </span>
            )}
          </div>
        ))}

        {/* Organizer-specific checkbox */}
        {type === "organizers" && (
          <div className="mb-4">
            <div className="flex items-center space-x-4">
              <input
                {...register("isOrganizer" as FieldPath<FormData>)}
                type="checkbox"
                className="md:scale-150 scale-175"
              />
              <label className="text-sm">
                I'm signing up as a Hackathon Organizer
              </label>
            </div>
            {errors.isOrganizer && (
              <span className="text-xs text-red-500 mt-1 block">
                {errors.isOrganizer.message}
              </span>
            )}
          </div>
        )}

        {/* Terms and conditions checkbox */}
        <div className="mb-4">
          <div className="flex items-center space-x-4">
            <input
              {...register("agreeToTerms" as FieldPath<FormData>)}
              type="checkbox"
              className="md:scale-150 scale-175"
            />
            <label className="text-sm">
              I agree to the Terms of Service and Privacy Policy
            </label>
          </div>
          {errors.agreeToTerms && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.agreeToTerms.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 bg-[#605DEC] w-full text-white py-3 cursor-pointer text-center rounded-sm hover:bg-[#4f4bcc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "Creating Account..."
            : type === "organizers"
            ? "Create Your Organizer Account"
            : "Sign Up & Explore Hackathons"}
        </button>
      </form>

      <div className="w-[80%] mx-auto my-4">
        <Divider>or</Divider>
      </div>

      <div className="w-full max-w-md space-y-3 mx-auto px-4">
        <Button
          onClick={signInGoogleAction}
          type="secondary"
          className="relative flex w-full items-center justify-center h-12"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            className="absolute left-3 h-5 w-5"
            alt="google logo"
            height="24"
            width="24"
          />
          <span className="text-sm md:text-base">Sign up with Google</span>
        </Button>

        <Button
          onClick={signInGithubAction}
          type="secondary"
          className="relative flex w-full items-center justify-center h-12"
        >
          <img
            src="https://authjs.dev/img/providers/github.svg"
            className="absolute left-3 h-5 w-5"
            alt="github logo"
            height="24"
            width="24"
          />
          <span className="text-sm md:text-base">Sign up with GitHub</span>
        </Button>
      </div>

      <p className="text-center mb-5 font-[600] mt-6 text-[#2F3036] text-sm">
        Already have an account?
        <Link
          className="underline pl-1 text-[#2E0BF4]"
          href={`/auth/login/${
            type === "organizers" ? "organizer" : "participant"
          }`}
        >
          Login here
        </Link>
      </p>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
