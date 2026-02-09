"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useJudgedHackathons } from "@/hooks/useJudges";
import { AnimatePresence, motion } from "framer-motion";
import { SignOutConfirmationModal } from "./signOutModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useIsLoggedIn } from "@/lib/logged-In";


export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
   const isLoggedIn = useIsLoggedIn();
     const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);
  const clearUser = useUserStore((state) => state.clearUser);
  const token = useAuthStore.getState().getToken();
  const user = useUserStore((state) => state.user);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const [showDropdown, setShowDropdown] = useState(false);
  const [logout, setLogout] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);



  // Initialize dark mode
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);

    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const handleLogout = () => {
    clearToken();
    clearUser();
    window.location.href = "/";
  };

  const closeMenu = () => setIsMenuOpen(false);

  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? "" }`;

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

  const { unauthorized } = useJudgedHackathons();
  const { canAccessJudges, loading } = useRoleAccess();

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                href="/"
                className="shrink-0 flex items-center"
                onClick={closeMenu}
              >
                <span className="text-xl font-semibold text-[#605DEC] transition-colors hover:text-[#4D4AE8]">
                  VORTEXIS
                </span>
              </Link>
            </div>

            {isLoggedIn && (
              <nav className="hidden md:flex absolute left-[45%] xl:left-1/2 transform -translate-x-1/2 space-x-4 xl:space-x-8">
                <Link
                  href="/features"
                  className="px-3 py-2 text-sm font-medium text-[#212121] dark:text-gray-300 hover:text-[#605DEC] transition-colors duration-200"
                >
                  Features
                </Link>
                <Link
                  href="/hackathon"
                  className="px-3 py-2 text-sm font-medium text-[#212121] dark:text-gray-300 hover:text-[#605DEC] transition-colors duration-200"
                >
                  Hackathons
                </Link>
                <Link
                  href="/about"
                  className="px-3 py-2 text-sm font-medium text-[#212121] dark:text-gray-300 hover:text-[#605DEC] transition-colors duration-200"
                >
                  About
                </Link>
              </nav>
            )}

            {!isLoggedIn && (
              <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
                <Link
                  href="/features"
                  className="px-3 py-2 text-sm font-medium text-[#212121] dark:text-gray-300 hover:text-[#605DEC] transition-colors duration-200"
                >
                  Features
                </Link>
                <Link
                  href="/hackathon"
                  className="px-3 py-2 text-sm font-medium text-[#212121] dark:text-gray-300 hover:text-[#605DEC] transition-colors duration-200"
                >
                  Hackathons
                </Link>
                <Link
                  href="/about"
                  className="px-3 py-2 text-sm font-medium text-[#212121] dark:text-gray-300 hover:text-[#605DEC] transition-colors duration-200"
                >
                  About
                </Link>
              </nav>
            )}

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-1">
              {/* Dark Mode Toggle */}

              {isLoggedIn && (
                <NotificationDropdown />

              )

              }


              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-4 xl:w-5 xl:h-5 h-4 text-yellow-500" />
                ) : (
                  <Moon className="w-4 xl:w-5 xl:h-5 h-4 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {!isLoggedIn ? (
                <>
                  <Link href="/auth/login">
                    <button
                      type="button"
                      className="px-4 cursor-pointer py-2 text-sm font-medium text-[#605DEC] border border-[#605DEC] rounded-lg hover:bg-[#605DEC] hover:text-white transition-all duration-200"
                    >
                      Log in
                    </button>
                  </Link>
                  <Link href="/auth/signup">
                    <button className="px-4 cursor-pointer py-2 text-sm font-medium text-white bg-[#605DEC] rounded-lg hover:bg-[#4D4AE8] transition-all duration-200">
                      Sign up
                    </button>
                  </Link>
                </>
              ) : (
                <div
                  className="flex items-center gap-5 md:gap-10 relative"
                  ref={dropdownRef}
                >
                  <div className="relative z-30">
                    {/* Avatar & Name */}
                    <div
                      className="flex items-center gap-2 cursor-pointer"
                      onClick={() => setShowDropdown((prev) => !prev)}
                    >
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${avatarColor}`}
                      >
                        {initials.toUpperCase()}
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-semibold">
                          {user?.first_name} {user?.last_name}
                        </p>
                      </div>
                      <ChevronDown className="text-gray-500 w-4 h-4" />
                    </div>

                    {/* Dropdown + Fullscreen Blur Overlay */}
                    <AnimatePresence>
                      {showDropdown && (
                        <>
                          {/* Fullscreen Blur Overlay */}
                          <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDropdown(false)}
                            className=""
                          />

                          {/* Dropdown Menu */}
                          <motion.div
                            key="dropdown"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-16 right-0 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg border z-50"
                          >
                            <ul className="py-2 text-sm text-gray-700 list-none dark:text-white">
                              <li>
                                <Link
                                  href="/profile/detail"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400"
                                >
                                  View Profile
                                </Link>
                              </li>
                              {/* Only show Organization link if backend verifies organizer access */}
                            
                                <li>
                                  <Link
                                    href="/organizer"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400"
                                  >
                                    Organization
                                  </Link>
                                </li>
                            
                                <li>
                                  <Link
                                    href="/dashboard"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400"
                                  >
                                    Hacker
                                  </Link>
                                </li>
                              {/* Only show Judges link if backend verifies judge access */}
                              {!loading && canAccessJudges && (
                                <li>
                                  <Link
                                    href="/judges"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400"
                                  >
                                    Judges
                                  </Link>
                                </li>
                              )}
                              <li>
                                <p
                                  onClick={() => setLogout(true)}
                                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-400"
                                >
                                  LogOut
                                </p>
                              </li>
                            </ul>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden gap-1">
              {/* Dark Mode Toggle - Mobile */}
              {isLoggedIn && (
                <NotificationDropdown />

              )

              }
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-1 rounded-md text-[#4D4D4D] hover:text-[#605DEC] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#605DEC] transition-all duration-200"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6 transition-transform duration-200" />
                ) : (
                  <div className="flex items-center gap-2">

                    <Menu className="block h-6 w-6 transition-transform duration-200" />

                  </div>

                )}
              </button>
              {isLoggedIn && (
                <div
                  className="flex items-center gap-5 md:gap-10 relative"
                  ref={dropdownRef}
                >
                  <div className="relative z-30">
                    {/* Avatar & Name */}
                    <div
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => setShowDropdown((prev) => !prev)}
                    >
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center text-white font-semibold text-sm ${avatarColor}`}
                      >
                        {initials.toUpperCase()}
                      </div>
                      <ChevronDown className="text-gray-500 w-4 h-4" />
                    </div>

                    {/* Dropdown + Fullscreen Blur Overlay */}
                    <AnimatePresence>
                      {showDropdown && (
                        <>
                          {/* Fullscreen Blur Overlay */}
                          <motion.div
                            key="overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDropdown(false)}
                            className=""
                          />

                          {/* Dropdown Menu */}
                          <motion.div
                            key="dropdown"
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-16 right-0 w-48 bg-white shadow-lg rounded-lg border z-50 dark:bg-gray-800"
                          >
                            <ul className="py-2 text-sm text-gray-700 list-none dark:text-white">
                              <li>
                                <Link
                                  href="/profile/detail"
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400"
                                >
                                  View Profile
                                </Link>
                              </li>
                            
                                <li>
                                  <Link
                                    href="/organizer"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400"
                                  >
                                    Organization
                                  </Link>
                                </li>
                            
                                <li>
                                  <Link
                                    href="/dashboard"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400"
                                  >
                                    Hacker
                                  </Link>
                                </li>
                              {/* Only show Judges link if backend verifies judge access */}
                              {!loading && canAccessJudges && (
                                <li>
                                  <Link
                                    href="/judges"
                                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-400"
                                  >
                                    Judges
                                  </Link>
                                </li>
                              )}
                              <li>
                                <p
                                  onClick={() => setLogout(true)}
                                  className="block px-4 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-400"
                                >
                                  LogOut
                                </p>
                              </li>
                            </ul>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )

              }
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
        >

          <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg">
            {/* Mobile Navigation Links */}
            <div className="pt-2 pb-3 space-y-1 px-4">
              <Link
                href="/features"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] dark:text-gray-300 hover:text-[#605DEC] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                Features
              </Link>
              <Link
                href="/hackathon"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] dark:text-gray-300 hover:text-[#605DEC] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                Hackathons
              </Link>
              <Link
                href="/about"
                className="block px-3 py-3 text-base font-medium text-[#4D4D4D] dark:text-gray-300 hover:text-[#605DEC] hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                onClick={closeMenu}
              >
                About
              </Link>
            </div>

            {/* Mobile Auth Buttons */}
            <div className="pt-4 pb-6 border-t border-gray-200 dark:border-gray-700">
              <div className="px-4 space-y-3">
                {!isLoggedIn ? (
                  <>
                    <Link href="/auth/login" onClick={closeMenu}>
                      <button
                        type="button"
                        className="w-full px-4 py-3 text-base font-medium text-[#605DEC] border border-[#605DEC] rounded-lg hover:bg-[#605DEC] hover:text-white transition-all duration-200"
                      >
                        Log in
                      </button>
                    </Link>
                    <Link href="/auth/signup" onClick={closeMenu}>
                      <button className="w-full px-4 mt-3 py-3 text-base font-medium text-white bg-[#605DEC] rounded-lg hover:bg-[#4D4AE8] transition-all duration-200">
                        Sign up
                      </button>
                    </Link>
                  </>
                ) : (
                  <div
                    className="flex items-center gap-5 md:gap-10 relative"
                    ref={dropdownRef}
                  >
                    <div className="relative z-30">

                      <div
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold text-sm ${avatarColor}`}
                        >
                          {initials.toUpperCase()}
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold">
                            {user?.first_name} {user?.last_name}
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>




        </div>
      </header>

      <SignOutConfirmationModal
        isOpen={logout}
        onClose={() => setLogout(false)}
        onConfirm={() => {
          handleLogout();
          setLogout(false);
        }}
      />

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-25 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          onClick={closeMenu}
        />
      )}
    </>
  );
};
