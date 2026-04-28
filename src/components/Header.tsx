"use client";
import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Moon, Sun, ChevronDown } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { usePathname } from "next/navigation";
import { useJudgedHackathons } from "@/hooks/useJudges";
import { AnimatePresence, motion } from "framer-motion";
import { SignOutConfirmationModal } from "./signOutModal";
import { NotificationDropdown } from "./NotificationDropdown";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useIsLoggedIn } from "@/lib/logged-In";
import Image from "next/image";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [logout, setLogout] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  const isLoggedIn = useIsLoggedIn();
  const clearToken = useAuthStore((state) => state.clearToken);
  const clearUser = useUserStore((state) => state.clearUser);
  const user = useUserStore((state) => state.user);
  
  // Refs for closing on outside click
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // --- CLICK OUTSIDE LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close desktop dropdown if clicking outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      // Close mobile menu if clicking outside (the drawer part)
      if (isMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        // Only close if we aren't clicking the toggle button itself
        const target = event.target as HTMLElement;
        if (!target.closest('.menu-toggle-btn')) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, isMenuOpen]);

  // Dark Mode Init
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const initials = `${user?.first_name?.[0] ?? ""}${user?.last_name?.[0] ?? ""}`.toUpperCase();
  const { canAccessJudges, loading } = useRoleAccess();

  const closeAll = () => {
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-800 shadow-sm fixed w-full z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="text-xl font-semibold text-[#605DEC]" onClick={closeAll}>
              VORTEXIS
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 space-x-8">
              {["Features", "Hackathon", "About"].map((link) => (
                <Link key={link} href={`/${link.toLowerCase()}`} className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-[#605DEC]">
                  {link}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              {isLoggedIn && <NotificationDropdown />}
              
              <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                {isDarkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5" />}
              </button>

              {!isLoggedIn ? (
                <div className="hidden md:flex space-x-2">
                  <Link href="/auth/login" className="px-4 py-2 text-sm text-[#605DEC] border border-[#605DEC] rounded-lg">Log in</Link>
                  <Link href="/auth/signup" className="px-4 py-2 text-sm bg-[#605DEC] text-white rounded-lg">Sign up</Link>
                </div>
              ) : (
                <div className=" md:block relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all  cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center overflow-hidden">
                      {user?.profile?.profile_picture ? (
                        <Image src={user.profile.profile_picture} alt="Profile" width={32} height={32} className="object-cover" />
                      ) : (
                        <span className="text-white text-xs font-bold">{initials}</span>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-12 right-0 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-xl border dark:border-gray-700 py-2 z-50"
                      >
                        <DropdownLinks canAccessJudges={canAccessJudges} loading={loading} onNavigate={closeAll} onLogout={() => setLogout(true)} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className="md:hidden p-2 menu-toggle-btn text-gray-600 dark:text-gray-300"
              >
                {isMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU DRAWER */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              ref={mobileMenuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white dark:bg-gray-800 border-t dark:border-gray-700 overflow-hidden"
            >
              <div className="p-4 space-y-4">
                <nav className="flex flex-col space-y-3">
                  {["Features", "Hackathon", "About"].map((link) => (
                    <Link key={link} href={`/${link.toLowerCase()}`} onClick={closeAll} className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {link}
                    </Link>
                  ))}
                </nav>
                
                <div className="pt-4 border-t dark:border-gray-700">
                  {!isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link href="/auth/login" className="hidden sm:block text-sm font-medium text-[#605DEC]">Log in</Link>
                <Link href="/auth/signup" className="px-4 py-2 bg-[#605DEC] text-white text-sm font-medium rounded-lg">Sign up</Link>
              </div>
            ) : (
              <div className="relative flex items-center gap-2" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <div className={`h-9 w-9 rounded-full overflow-hidden flex items-center justify-center text-white font-bold text-xs`}>
                    {user?.profile?.profile_picture ? (
                      <Image src={user.profile.profile_picture} alt="Profile" width={36} height={36} className="object-cover w-full h-full" />
                    ) : (
                      initials
                    )}
                  </div>

                </button>
                <p className="inline-block">{user?.first_name} {" "}   {user?.last_name}</p>
                </div>
            )}
               
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SignOutConfirmationModal isOpen={logout} onClose={() => setLogout(false)} onConfirm={() => { clearToken(); clearUser(); window.location.href = "/"; }} />
    </>
  );
};

const DropdownLinks = ({ canAccessJudges, loading, onNavigate, onLogout }: any) => (
  <ul className="list-none p-0 m-0">
    {[
      { label: "View Profile", href: "/profile/detail" },
      { label: "Organization Dashboard", href: "/organizer" },
      { label: "Hacker Dashboard", href: "/dashboard" },
    ].map((link) => (
      <li key={link.href}>
        <Link href={link.href} onClick={onNavigate} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">
          {link.label}
        </Link>
      </li>
    ))}
    {!loading && canAccessJudges && (
      <li><Link href="/judges" onClick={onNavigate} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm">Judges</Link></li>
    )}
    <li className="border-t dark:border-gray-700 mt-1">
      <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
        Log Out
      </button>
    </li>
  </ul>
);