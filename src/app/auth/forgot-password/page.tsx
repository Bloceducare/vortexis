"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import Button from "@/components/ui/AuthButton";
import Input from "@/components/ui/AuthInput";

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
      console.log(response.json());

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              VORTEXIS
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link
                href="/features"
                className="text-gray-600 hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/hackathons"
                className="text-gray-600 hover:text-gray-900"
              >
                Hackathons
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button className="border border-gray-300 bg-transparent text-blue-600 hover:bg-gray-100">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 hover:bg-blue-700">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          {!isSubmitted ? (
            <>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-600 mb-4">
                  Forgot Password?
                </h1>
                <p className="text-gray-600">
                  No Worries! Enter Your Email And We'll Send You Reset
                  Instructions.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8">
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
                      className={`w-full ${
                        error
                          ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                          : ""
                      }`}
                      required
                    />
                    {error && (
                      <p className="text-sm text-red-600 mt-1">{error}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-medium"
                  >
                    {isLoading ? "Sending..." : "Send Reset Instructions"}
                  </Button>
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
                <h1 className="text-3xl font-bold text-blue-600 mb-4">
                  Check Your Email
                </h1>
                <p className="text-gray-600 mb-2">
                  We've sent a password reset to {email}
                </p>
                <p className="text-gray-500 text-sm">
                  didn't receive the email? check your spam folder or try again.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-8 text-center space-y-4">
                <button
                  onClick={handleTryDifferentEmail}
                  className="text-blue-600 hover:text-blue-700 font-medium"
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
