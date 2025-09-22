"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Error from "@/public/page-error.svg";

export default function AuthErrorPage() {
  const [countdown, setCountdown] = useState(60);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push("/auth/signin/participant");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleTryAgain = () => {
    router.push("/auth/login/participant");
  };
  const handleCreate = () => {
    router.push("/auth/signin/participant");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-2xl font-bold text-blue-600">VORTEXIS</div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleTryAgain}
              className="px-4 py-2 cursor-pointer border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Login
            </button>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8 relative">
            <div className="w-80 h-64 mx-auto relative">
              <img
                src={Error.src}
                alt="Authentication Error"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">
              Authentication Required!
            </h3>
            <p className="text-gray-600 text-lg mb-4">
              {"You need to log in to access this page."}
            </p>
            <p className="text-gray-500">
              Redirecting to sign up in{" "}
              <span className="font-semibold text-blue-600">{countdown}</span>{" "}
              seconds...
            </p>
          </div>

          <button
            onClick={handleTryAgain}
            className="px-8 py-3 cursor-pointer bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg"
          >
            Login{" "}
          </button>
        </div>
      </main>
    </div>
  );
}
