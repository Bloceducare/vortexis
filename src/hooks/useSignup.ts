"use client";

// hooks/use-signup-form.ts
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  type OrganizerFormData,
  organizerSchema,
  type ParticipantFormData,
  participantSchema,
} from "@/lib/validator";

// Create a union type for all possible form data
type FormData = OrganizerFormData | ParticipantFormData;

type AuthFormType = "organizers" | "participants";

export function useSignUpForm(type: AuthFormType) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const schema = type === "organizers" ? organizerSchema : participantSchema;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const toggleShowPassword = (fieldName: string) => {
    setShowPassword((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log("Raw form data:", data);

      // Clean up the data and map to backend expected field names
      const { confirmPassword, agreeToTerms, isOrganizer, ...cleanData } =
        data as any;

      // Create the payload with correct field names for backend
      const payload: any = {
        first_name: cleanData.name,
        last_name: cleanData.lastName,
        email: cleanData.email,
        password: cleanData.password,
        password2: cleanData.confirmPassword || data.confirmPassword,
        user_type: type === "organizers" ? "organizer" : "participant",
      };

      // Add organizer-specific fields
      if (type === "organizers") {
        payload.organization = cleanData.organization;
        if (cleanData.phone) {
          payload.phone = cleanData.phone;
        }
      }

      // Add participant-specific fields
      if (type === "participants") {
        payload.username = cleanData.userName;
      }

      // Remove empty/undefined fields
      Object.keys(payload).forEach((key) => {
        if (
          payload[key] === "" ||
          payload[key] === undefined ||
          payload[key] === null
        ) {
          delete payload[key];
        }
      });

      console.log("Cleaned payload being sent:", payload);
      console.log("Payload as JSON string:", JSON.stringify(payload, null, 2));

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/register/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      const responseText = await response.text();
      console.log("Raw response body:", responseText);

      let responseData: any = null;
      try {
        responseData = JSON.parse(responseText);
        console.log("Parsed response data:", responseData);
      } catch (parseError) {
        console.log("Response is not JSON:", responseText.substring(0, 200));
      }

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`);
        let errorMessage = "Failed to create account. Please try again.";

        if (responseData) {
          errorMessage =
            responseData.message ||
            responseData.error ||
            responseData.detail ||
            responseData.errors ||
            JSON.stringify(responseData);

          if (responseData.errors && typeof responseData.errors === "object") {
            const errorMessages = Object.entries(responseData.errors)
              .map(
                ([field, messages]) =>
                  `${field}: ${
                    Array.isArray(messages) ? messages.join(", ") : messages
                  }`
              )
              .join("; ");
            errorMessage = errorMessages;
          }
        }

        if (response.status === 400) {
          toast.error(`${errorMessage}`);
        } else if (response.status === 409) {
          toast.error("An account with this email already exists.");
        } else {
          toast.error(`Error (${response.status}): ${errorMessage}`);
        }
        return;
      }

      // Success case
      if (responseData) {
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        reset();
        router.push(`/auth/verify-otp?email=${data.email}`);
      } else {
        toast.success("Account created successfully!");
        reset();
      }
    } catch (error) {
      console.error("Error creating account:", error);
      if (error instanceof TypeError && error.message.includes("fetch")) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    isSubmitting,
    showPassword,
    toggleShowPassword,
    onSubmit,
    form, 
  };
}
