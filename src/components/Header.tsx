"use client";

import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // New state for login status
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    // Function to check login status from localStorage
    const checkLoginStatus = () => {
      const token = localStorage.getItem("access_token");
      setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
    };

    // Check status on component mount
    checkLoginStatus();

    // Listen for changes in localStorage across tabs/windows
    window.addEventListener("storage", checkLoginStatus);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []); // Empty dependency array means this runs once on mount and cleanup on unmount

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_email");
    localStorage.removeItem("user_full_name");
    localStorage.removeItem("username");

    setIsLoggedIn(false); // Update local state
    router.push("/"); // Redirect to home page after logout
  };

  return (
    <header className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="ml-2 text-xl font-semibold text-[#605DEC]">
                VORTEXIS
              </span>
            </Link>
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
              <Link
                href="/features"
                className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-gray-900"
              >
                Features
              </Link>
              <Link
                href="/hackathons"
                className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-gray-900"
              >
                Hackathons
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-gray-900"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {!isLoggedIn ? (
              <>
                <Link href="/auth/login/participant">
                  <button type="button" className="w-full border-[#009AFF]">
                    Log in
                  </button>
                </Link>
                <Link href="/auth/signin/participant">
                  <button className="w-full">Sign up</button>
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="w-full">
                Logout
              </button>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#4D4D4D] hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/features"
              className="block px-3 py-2 text-base font-medium text-[#4D4D4D] hover:text-gray-900"
            >
              Features
            </Link>
            <Link
              href="/hackathons"
              className="block px-3 py-2 text-base font-medium text-[#4D4D4D] hover:text-gray-900"
            >
              Hackathons
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-[#4D4D4D] hover:text-gray-900"
            >
              About
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 space-y-3">
              {!isLoggedIn ? (
                <div className="space-y-3">
                  <Link href="/auth/login/participant" className="block">
                    <button type="button" className="w-full border-[#009AFF]">
                      Log in
                    </button>
                  </Link>
                  <Link href="/auth/signin/participant">
                    <button className="w-full">Sign up</button>
                  </Link>
                </div>
              ) : (
                <button
                  onClick={handleLogout}
                  className="w-full bg-red-500 rounded-2xl cursor-pointer"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
