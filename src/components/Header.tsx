"use client";
import type React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation"; 
import SearchInput from "./ui/SearchInput";


export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);
  const clearUser = useUserStore((state) => state.clearUser)
  const token = useAuthStore.getState().getToken();
  const user = useUserStore((state) => state.user);
    const pathname = usePathname(); 
  
  
    const isHome = pathname.startsWith("/home")
    const isProfile = pathname.startsWith("/profile")


    const handleSearch = (query: string) => {
      console.log("Search for:", query);
    };
  


  useEffect(() => {
    const checkLoginStatus = () => {
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    clearToken();
    clearUser();
    setIsLoggedIn(false);
    router.push("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`;

  const bgColors = [
    "bg-red-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
  ];
  const firstCharCode = user?.first_name?.charCodeAt(0) ?? 0;
  const lastCharCode = user?.last_name?.charCodeAt(0) ?? 0;
  const colorIndex = (firstCharCode + lastCharCode) % bgColors.length;
  const avatarColor = bgColors[colorIndex];


  return (
    <>
      <header className="bg-white shadow-sm fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="flex-shrink-0 flex items-center"
                onClick={closeMenu}
              >
                <span className="text-xl font-semibold text-[#605DEC] transition-colors hover:text-[#4D4AE8]">
                  VORTEXIS
                </span>
              </Link>
            </div>


            {(isHome || isProfile) && (
             <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
                <Link
               href="/dashboard"
               className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-[#605DEC] transition-colors duration-200"
             >
               Participants
             </Link>
             <Link
               href="/organizer"
               className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-[#605DEC] transition-colors duration-200"
             >
               Organizer
             </Link>
           
             <Link
               href="/judges"
               className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-[#605DEC] transition-colors duration-200"
             >
               Judges
             </Link>
           </nav>
          ) }

             {!isHome && !isProfile && (    <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
              <Link
                href="/features"
                className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-[#605DEC] transition-colors duration-200"
              >
                Features
              </Link>
              <Link
                href="/hackathons"
                className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-[#605DEC] transition-colors duration-200"
              >
                Hackathons
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-[#212121] hover:text-[#605DEC] transition-colors duration-200"
              >
                About
              </Link>
            </nav>)}

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              {!isLoggedIn ? (
                <>
                  <Link href="/auth/login/participant">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-[#605DEC] border border-[#605DEC] rounded-lg hover:bg-[#605DEC] hover:text-white transition-all duration-200"
                    >
                      Log in
                    </button>
                  </Link>
                  <Link href="/auth/signin/participant">
                    <button className="px-4 py-2 text-sm font-medium text-white bg-[#605DEC] rounded-lg hover:bg-[#4D4AE8] transition-all duration-200">
                      Sign up
                    </button>
                  </Link>
                </>
              ) : (
                <div className="flex gap-10 items-center">
                    <div
            className="flex items-center gap-2"
            // onClick={() => setShowDropdown((prev) => !prev)}
          >
            {/* Avatar */}
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${avatarColor}`}
            >
              {initials.toUpperCase()}
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold">
                {user?.first_name} {user?.last_name}
              </p>
              {/* <p className="text-sm text-[#4F5B67]">{currentDashboard}</p> */}
            </div>
            {/* <ChevronDown className="text-gray-500 w-4 h-4" /> */}
          </div>



                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-[#4D4D4D] hover:text-[#605DEC] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#605DEC] transition-all duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6 transition-transform duration-200" />
                ) : (
                  <Menu className="block h-6 w-6 transition-transform duration-200" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
       {!isHome && !isProfile && (  <div className="bg-white border-t border-gray-200 shadow-lg">
            {/* Mobile Navigation Links */}
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link
                href="/features"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] hover:text-[#605DEC] hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link
                href="/hackathons"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] hover:text-[#605DEC] hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                Hackathons
              </Link>
              <Link
                href="/about"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] hover:text-[#605DEC] hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                About
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-6 border-t border-gray-200">
              <div className="px-4 space-y-3">
                {!isLoggedIn ? (
                  <>
                    <Link href="/auth/login/participant" onClick={closeMenu}>
                      <button
                        type="button"
                        className="w-full px-4 py-3 text-base font-medium text-[#605DEC] border border-[#605DEC] rounded-lg hover:bg-[#605DEC] hover:text-white transition-all duration-200"
                      >
                        Log in
                      </button>
                    </Link>
                    <Link href="/auth/signin/participant" onClick={closeMenu}>
                      <button className="w-full px-4 mt-3 py-3 text-base font-medium text-white bg-[#605DEC] rounded-lg hover:bg-[#4D4AE8] transition-all duration-200">
                        Sign up
                      </button>
                    </Link>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full px-4 py-3 text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-200"
                  >
                    Logout
                  </button>
                )}
              </div>
            </div>
          </div>)}
          {(isHome || isProfile) && ( <div className="bg-white border-t border-gray-200 shadow-lg">
            {/* Mobile Navigation Links */}
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link
                href="/dashboard"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] hover:text-[#605DEC] hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                Participants
              </Link>
              <Link
                href="/organizer"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] hover:text-[#605DEC] hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                Organizer
              </Link>
              <Link
                href="/judge"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] hover:text-[#605DEC] hover:bg-gray-50 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                Judges
              </Link>
            </div>
          </div>)}
        </div>
      </header>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-25 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}
    </>
  );
};
