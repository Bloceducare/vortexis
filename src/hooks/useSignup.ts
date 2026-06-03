"use client";

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

type FormDataMap = {
  organizers: OrganizerFormData;
  participants: ParticipantFormData;
};

export function useSignUpForm<T extends AuthFormType>(type: T) {
  type CurrentFormData = FormDataMap[T];

  const router = useRouter();
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    try {
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

      const responseText = await response.text();

      let responseData: any = null;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        // Response is not JSON
      }

      if (!response.ok) {
        console.error(`HTTP Error: ${response.status} ${response.statusText}`);
        let errorMessage = "Failed to create account. Please try again.";

        if (responseData) {
          const extractErrorMessage = (data: any): string => {
            if (data.errors && typeof data.errors === "object") {
              const errorMessages = Object.entries(data.errors)
                .map(([field, messages]) => {
                  const msgArray = Array.isArray(messages) ? messages : [messages];
                  return msgArray.map(msg =>
                    field === "non_field_errors" ? msg : `${field}: ${msg}`
                  ).join(", ");
                })
                .join("; ");
              return errorMessages;
            }

            // Check for direct field errors at root level (e.g., { email: ['error'], username: ['error'] })
            const possibleFieldErrors = Object.keys(data).filter(key =>
              Array.isArray(data[key]) &&
              typeof data[key][0] === 'string' &&
              !['message', 'error', 'detail', 'status'].includes(key)
            );

            if (possibleFieldErrors.length > 0) {
              const errorMessages = possibleFieldErrors
                .map(field => {
                  const messages = data[field];
                  return messages.map((msg: string) =>
                    field === "non_field_errors" ? msg : `${field.charAt(0).toUpperCase() + field.slice(1)}: ${msg}`
                  ).join(", ");
                })
                .join("; ");
              return errorMessages;
            }

            if (data.message) return data.message;
            if (data.error) return data.error;
            if (data.detail) return data.detail;

            return "Failed to create account. Please check your information and try again.";
          };

          errorMessage = extractErrorMessage(responseData);
        }

        if (response.status === 400) {
          toast.error(errorMessage);
        } else if (response.status === 409) {
          toast.error("An account with this email already exists.");
        } else {
          toast.error(`Error (${response.status}): ${errorMessage}`);
        }
        return;
      }

      if (responseData) {
        toast.success(
          "Account created successfully! Please check your email to verify your account."
        );
        reset();
        const trimmedEmailForRedirect = (data as any).email.trim();
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
