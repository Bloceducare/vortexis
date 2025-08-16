"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/AuthButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/auth/forgot-password/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();
      console.log("[v0] API response:", data);

      if (response.ok) {
        setIsSubmitted(true);
      } else if (response.status === 404) {
        setError("User not found");
      } else if (response.status === 400) {
        setError("Invalid email address");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("[v0] Network error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryDifferentEmail = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="flex items-center justify-center min-h-screen">
        <div className="w-full shadow-md max-w-md">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#605DEC] mb-4">
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  No Worries! Enter Your Email And We'll Send You Reset
                  Instructions.
                </p>
              </div>

              <div className="rounded-lg shadow-lg p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address used in creating your account"
                      className={`w-full p-2 border rounded-md text-center text-lg tracking-widest focus:outline-none focus:ring-2 focus:ring-[#1E1E1E] focus:border-transparent ${
                        error ? "border-red-500" : "border-gray-300"
                      }`}
                      required
                    />
                    {error && (
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#605DEC] rounded-xs py-3 text-base font-medium"
                    onClick={handleSubmit}
                  >
                    {isLoading ? "Sending..." : "Send Reset Instructions"}
                  </button>
                </form>

                <div className="text-center mt-6">
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-[#605DEC] mb-4">
                  Check Your Email
                </h1>
                <p className="text-gray-600 mb-2">
                  We've sent a password reset to {email}
                </p>
                <p className="text-gray-500 text-sm">
                  didn't receive the email? check your spam folder or try again.
                </p>
              </div>

              <div className=" rounded-lg shadow-lg p-8 text-center space-y-4">
                <button
                  onClick={handleTryDifferentEmail}
                  className="text-[#605DEC] font-medium"
                >
                  Try Different Email
                </button>

                <div>
                  <Link
                    href="/login"
                    className="text-gray-600 hover:text-gray-900 text-sm"
                  >
                    Back to Login
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
