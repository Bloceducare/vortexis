"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { otpSchema, type OtpFormData } from "@/lib/validator";
import { useRouter } from "next/navigation";

interface OtpVerificationFormProps {
  email: string;
}

export default function OtpVerificationForm({
  email,
}: OtpVerificationFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      email: email,
      otp: "",
    },
  });

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResending && resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    } else if (resendCooldown === 0) {
      setIsResending(false);
      setResendCooldown(60);
    }
    return () => clearTimeout(timer);
  }, [isResending, resendCooldown]);

  const onSubmit = async (data: OtpFormData) => {
    setIsSubmitting(true);

    const payload = {
      email: data.email.trim().toLowerCase(),
      code: data.otp.trim(),
    };

    if (!payload.code) {
      toast.error("Please enter a valid OTP.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify/`,
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
      } catch (parseError) {}

      if (!response.ok) {
        let errorMessage = "OTP verification failed. Please try again.";

        if (responseData) {
          errorMessage =
            responseData.message ||
            responseData.detail ||
            responseData.code ||
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

        toast.error(`Error (${response.status}): ${errorMessage}`);
        return;
      }

      toast.success(
        "Account verified successfully! Redirecting to dashboard..."
      );
      reset();
      router.push("/hackathon");
    } catch (error) {
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

  const handleResendOtp = async () => {
    const normalizedEmail = email?.trim().toLowerCase();
    if (
      !normalizedEmail ||
      typeof normalizedEmail !== "string" ||
      !normalizedEmail.includes("@") ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)
    ) {
      toast.error("Please provide a valid email address.");
      return;
    }

    setIsResending(true);
    setResendCooldown(60);

    try {
      if (!process.env.NEXT_PUBLIC_BASE_URL) {
        throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/resend-otp/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email: normalizedEmail }),
        }
      );

      const responseText = await response.text();

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error("Invalid response format from server");
      }

      if (response.ok) {
        toast.success("New OTP sent successfully! Please check your email.");
      } else {
        const errorMessage =
          responseData.message ||
          responseData.detail ||
          responseData.errors ||
          `Failed to resend OTP (Status: ${response.status})`;
        toast.error(`Failed to resend OTP: ${errorMessage}`);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error && error.message.includes("NEXT_PUBLIC_BASE_URL")
          ? "Configuration error. Please contact support."
          : "Network error while trying to resend OTP.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="shadow-md bg-white w-full max-w-[500px] mx-auto h-full rounded-[24px] p-6 md:p-8">
      <h1 className="text-2xl text-center py-4 text-[#2E0BF4] font-[700]">
        Verify Your Account
      </h1>
      <p className="text-center text-gray-600 mb-6">
        An OTP has been sent to <span className="font-semibold">{email}</span>.
        Please enter it below to verify your account.
      </p>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="text-[#2F3036] p-2 w-[95%] mx-auto"
      >
        <div className="mb-4">
          <label htmlFor="otp" className="block font-[700] text-sm mb-1">
            One-Time Password (OTP)
          </label>
          <input
            {...register("otp")}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter 6-digit OTP"
            maxLength={6}
            className={`w-full p-2 border rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent ${
              errors.otp ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.otp && (
            <span className="text-xs text-red-500 mt-1 block">
              {errors.otp.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-4 bg-[#605DEC] w-full text-white py-3 cursor-pointer text-center rounded-sm hover:bg-[#4f4bcc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verifying..." : "Verify Account"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={isResending}
            className="text-[#2E0BF4] text-sm hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {isResending ? `Resend OTP in ${resendCooldown}s` : "Resend OTP"}
          </button>
        </div>
      </form>

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
