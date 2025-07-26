"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { signInGithubAction, signInGoogleAction } from "@/lib/actions";
import Input from "./AuthInput";
import Button from "./AuthButton";
import Divider from "./Divider";

const organizerFormFields = [
  {
    name: "name",
    label: "Name",
    type: "text",
    placeholder: "Enter your full name...",
    eyeView: false,
  },
  {
    name: "email",
    label: "Email Address",
    type: "email",
    placeholder: "Enter your email address...",
    eyeView: false,
  },
  {
    name: "organization",
    label: "Organization / Company Name",
    type: "text",
    placeholder: "The name of your company / organization",
    eyeView: false,
  },
  {
    name: "phone",
    label: "Phone Number (Optional)",
    type: "tel",
    placeholder: "+123",
    eyeView: false,
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Input your password",
    eyeView: true,
  },
  {
    name: "confirmPassword",
    label: "Confirm Password",
    type: "password",
    placeholder: "Confirm your password",
    eyeView: true,
  },
] as const; // 'as const' for literal type inference

type FormField = (typeof organizerFormFields)[number];
type AuthFormType = "organizers" | "participants";

interface SignUpFormProps {
  type: AuthFormType;
  // fields: FormField[];
}

export default function SignUpForm({ type }: SignUpFormProps) {
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );

  const toggleShowPassword = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  return (
    <div className="shadow-md bg-white md:w-[798px] h-full rounded-[24px] p-2">
      <h1 className="text-2xl text-center py-4 text-[#2E0BF4] font-[700] ">
        {type === "organizers"
          ? "Create Your Organizer Account"
          : "Create Your Participant Account"}
      </h1>

      <form className="text-[#2F3036] p-2 w-[95%] mx-auto">
        {organizerFormFields.map((field) => (
          <div key={field.name} className="mb-4 relative">
            <label className="block font-[700] text-sm">{field.label}</label>
            {!field.eyeView && (
              <input
                type={field.type}
                placeholder={field.placeholder}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                required
              />
            )}
            {field.eyeView && (
              <div>
                <input
                  type={showPassword[field.name] ? "text" : "password"}
                  placeholder={field.placeholder}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent"
                  required
                />
                <div
                  className="absolute right-3 top-7.5 cursor-pointer"
                  onClick={() => toggleShowPassword(field.name)}
                >
                  {showPassword[field.name] ? (
                    <span>
                      <EyeOff />
                    </span>
                  ) : (
                    <span>
                      <Eye />
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        <p className="flex items-center mt-7 mb-2 space-x-4">
          <input type="checkbox" className="md:scale-150 scale-175" />{" "}
          <label>I'm signing up as a Hackathon Organizer</label>
        </p>
        <p className="flex items-center  mb-2 space-x-4">
          <input type="checkbox" className="md:scale-150 scale-175" />{" "}
          <label>I agree to the Terms of Service and Privacy Policy</label>
        </p>

        <button className="mt-4 bg-[#605DEC] w-full md:block flex justify-center text-white py-3 cursor-pointer text-center rounded-sm">
          Create
        </button>
      </form>

      <div className="w-[80%] mx-auto">
        <Divider>or</Divider>
      </div>

      <div className="w-[93%] mx-auto">
        <Button
          onClick={signInGoogleAction}
          type="secondary"
          className="relative flex w-[90%] items-center justify-center"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            className="absolute left-3 h-5 w-5"
            alt="google logo"
            height="24"
            width="24"
          />
          Sign in with Google
        </Button>
      </div>
      <p className="text-center mb-5 font-[600] mt-3 text-[#2F3036]">
        {type === "organizers"
          ? "Already have an organizer account?"
          : "Already have a participant account?"}
        <Link className="underline pl-1" href="/auth/login/organizer">
          Login here
        </Link>
      </p>
    </div>
  );
}
