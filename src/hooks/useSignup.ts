"use client";

// hooks/use-signup-form.ts
import { useState } from "react";
import {
  useForm,
  type UseFormReturn,
  type SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  type OrganizerFormData,
  organizerSchema,
  type ParticipantFormData,
  participantSchema,
} from "@/lib/validator";

type AuthFormType = "organizers" | "participants";

// Create a type map to get the correct form data type based on auth type
type FormDataMap = {
  organizers: OrganizerFormData;
  participants: ParticipantFormData;
};

// Make the hook generic
export function useSignUpForm<T extends AuthFormType>(type: T) {
  type CurrentFormData = FormDataMap[T];

  const router = useRouter();
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get the correct schema based on type
  const schema = type === "organizers" ? organizerSchema : participantSchema;

  // Use the specific form data type instead of union
  const form = useForm<CurrentFormData>({
    resolver: zodResolver(schema as any), // Type assertion needed here
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

  const onSubmit: SubmitHandler<CurrentFormData> = async (data) => {
    setIsSubmitting(true);
    console.log("onSubmit: Setting isSubmitting to TRUE");
    try {
      console.log("Raw form data:", data);

      // Clean up the data and map to backend expected field names
      const { confirmPassword, agreeToTerms, isOrganizer, ...cleanData } =
        data as any;

      // Create the payload with correct field names for backend
      const payload: any = {
        first_name: (cleanData as any).name,
        last_name: (cleanData as any).lastName,
        email: (cleanData as any).email.trim(),
        password: (cleanData as any).password,
        password2: confirmPassword || (data as any).confirmPassword,
        user_type: type === "organizers" ? "organizer" : "participant",
      };

      // Add organizer-specific fields
      if (type === "organizers") {
        const orgData = cleanData as any;
        payload.organization = orgData.organization;
        if (orgData.phone) {
          payload.phone = orgData.phone;
        }
      }

      // Add participant-specific fields
      if (type === "participants") {
        const partData = cleanData as any;
        payload.username = partData.userName;
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
        const trimmedEmailForRedirect = (data as any).email.trim();
        console.log(
          "Redirecting to OTP page with email:",
          trimmedEmailForRedirect
        );
        router.push(`/auth/verify-otp?email=${trimmedEmailForRedirect}`);
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
      console.log("onSubmit: Setting isSubmitting to FALSE (finally block)");
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
