"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../components/ui/Button";
import web3logo from "@/public/assets/web3logo.svg";
import SearchForm from "@/components/Search-form";
import { useSession } from "next-auth/react";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  const { data: session } = useSession();
  const user = session?.user?.name;

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src={web3logo}
                alt="Hackathon Platform"
                width={24}
                height={24}
              />
              <span className="ml-2 text-xl font-semibold text-[#4D4D4D]">
                Web3 Lagos
              </span>
            </Link>
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-[#4D4D4D] hover:text-gray-900"
              >
                Home
              </Link>
              <Link
                href="/hackathon"
                className="px-3 py-2 text-sm font-medium text-[#4D4D4D] hover:text-gray-900"
              >
                Join a hackathon
              </Link>
              <Link
                href="/sponsors"
                className="px-3 py-2 text-sm font-medium text-[#4D4D4D] hover:text-gray-900"
              >
                Host a hackaton
              </Link>
              <button
                onClick={toggleSearch}
                className="px-3 py-2 text-sm font-medium text-[#4D4D4D] hover:text-gray-900 cursor-pointer"
              >
                Search
              </button>
            </nav>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            {!user ? (
              <>
                <Link href="/auth/login">
                  <Button
                    variant="outline"
                    className="w-full  border-[#009AFF]"
                  >
                    Log in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button variant="primary" className="w-full">
                    Sign up
                  </Button>
                </Link>
              </>
            ) : (
              <Link href="/api/auth/signout?callbackUrl=/">
                <Button variant="primary" className="w-full">
                  Logout
                </Button>
              </Link>
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

      {/* Search container that shows when search is toggled */}
      {showSearch && (
        <div>
          <SearchForm />
        </div>
      )}

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block px-3 py-2 text-base font-medium text-[#4D4D4D] hover:text-gray-900"
            >
              Home
            </Link>
            <Link
              href="/hackathons"
              className="block px-3 py-2 text-base font-medium text-[#4D4D4D] hover:text-gray-900"
            >
              Join a Hackathons
            </Link>
            <Link
              href="/sponsors"
              className="block px-3 py-2 text-base font-medium text-[#4D4D4D] hover:text-gray-900"
            >
              Host a hackaton
            </Link>
            <button
              onClick={toggleSearch}
              className="block w-full text-left px-3 py-2 text-base font-medium text-[#4D4D4D] hover:text-gray-900"
            >
              Search
            </button>
          </div>

          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="px-4 space-y-3">
              {!user ? (
                <div className="space-y-3">
                  <Link href="/auth/login" className="block">
                    <Button
                      variant="outline"
                      className="w-full  border-[#009AFF]"
                    >
                      Log in
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button variant="primary" className="w-full">
                      Sign up
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button variant="primary" className="w-full">
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
