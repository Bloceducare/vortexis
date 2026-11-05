"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  Sparkles,
  User,
  LayoutDashboard,
  Building2,
  Trophy,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useThemeStore } from "@/store/useThemeStore";
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
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();
  const isLoggedIn = useIsLoggedIn();
  const clearToken = useAuthStore((state) => state.clearToken);
  const clearUser = useUserStore((state) => state.clearUser);
  const user = useUserStore((state) => state.user);
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  // Refs for closing on outside click
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  // Scroll detection for dynamic blur and border
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- CLICK OUTSIDE LOGIC ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
      if (
        isMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        if (!target.closest(".menu-toggle-btn")) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown, isMenuOpen]);

  const initials = `${user?.first_name?.[0] ?? ""}${
    user?.last_name?.[0] ?? ""
  }`.toUpperCase();
  const { canAccessJudges, loading } = useRoleAccess();

  const closeAll = () => {
    setShowDropdown(false);
    setIsMenuOpen(false);
  };

  const navLinks = [
    { name: "Features", href: "/features" },
    { name: "Hackathons", href: "/hackathon" },
    { name: "About", href: "/about" },
    { name: "FAQs", href: "/faqs" },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/85 dark:bg-gray-900/85 backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/80 shadow-xs"
            : "bg-white/60 dark:bg-gray-900/60 backdrop-blur-md border-b border-gray-100/40 dark:border-gray-800/40"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 group cursor-pointer"
              onClick={closeAll}
            >
              <Image
                src="/logos/vortexis-logo-color.svg"
                alt="Vortexis"
                width={138}
                height={32}
                priority
                className="h-7 sm:h-8 w-auto dark:hidden"
              />
              <Image
                src="/logos/vortexis-logo-reversed.svg"
                alt="Vortexis"
                width={138}
                height={32}
                priority
                className="h-7 sm:h-8 w-auto hidden dark:block"
              />
            </Link>

            {/* Desktop Center Nav Pill */}
            <nav className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-100/70 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xs">
              {navLinks.map((link) => {
                const isActive =
                  pathname === link.href ||
                  (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-white dark:bg-gray-700 text-[#605DEC] dark:text-white shadow-xs"
                        : "text-gray-600 dark:text-gray-300 hover:text-[#605DEC] dark:hover:text-white hover:bg-white/60 dark:hover:bg-gray-700/50"
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons & Auth */}
            <div className="flex items-center space-x-2.5 sm:space-x-3">
              {isLoggedIn && <NotificationDropdown />}

              {/* Theme Toggle Button */}
              <button
                onClick={toggleDarkMode}
                aria-label="Toggle theme"
                className="p-2 rounded-full border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-800/70 text-gray-600 dark:text-gray-300 hover:text-[#605DEC] dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all shadow-xs cursor-pointer"
              >
                {isDarkMode ? (
                  <Sun className="w-4 h-4 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 text-indigo-500" />
                )}
              </button>

              {!isLoggedIn ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    href="/auth/login"
                    className="px-3.5 py-2 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:text-[#605DEC] dark:hover:text-white transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="px-4.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-[#605DEC] to-[#7B73F6] hover:from-[#514ecb] hover:to-[#6c64eb] rounded-full shadow-sm shadow-indigo-500/25 hover:shadow-md hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
                  >
                    Sign up
                  </Link>
                </div>
              ) : (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-800/70 hover:border-indigo-300 dark:hover:border-indigo-500/40 transition-all cursor-pointer shadow-xs"
                  >
                    <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#605DEC] to-[#8A85FF] flex items-center justify-center overflow-hidden text-white font-bold text-xs">
                      {user?.profile?.profile_picture ? (
                        <Image
                          src={user.profile.profile_picture}
                          alt="Profile"
                          width={28}
                          height={28}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span>{initials}</span>
                      )}
                    </div>
                    <span className="hidden lg:inline text-xs font-semibold text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                      {user?.first_name || "Account"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-200 ${
                        showDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute top-12 right-0 w-56 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl rounded-2xl border border-gray-200/80 dark:border-gray-700/80 p-1.5 z-50 overflow-hidden"
                      >
                        {user && (
                          <div className="px-3 py-2 border-b border-gray-100 dark:border-gray-700/60 mb-1">
                            <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {user.first_name} {user.last_name}
                            </p>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">
                              {user.email}
                            </p>
                          </div>
                        )}
                        <DropdownLinks
                          canAccessJudges={canAccessJudges}
                          loading={loading}
                          onNavigate={closeAll}
                          onLogout={() => setLogout(true)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-full border border-gray-200/70 dark:border-gray-700/70 bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200 hover:text-[#605DEC] menu-toggle-btn transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
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
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200/70 dark:border-gray-800/80 overflow-hidden shadow-xl"
            >
              <div className="p-5 space-y-4">
                <nav className="flex flex-col space-y-1">
                  {navLinks.map((link) => {
                    const isActive =
                      pathname === link.href ||
                      (link.href !== "/" && pathname.startsWith(link.href));
                    return (
                      <Link
                        key={link.name}
                        href={link.href}
                        onClick={closeAll}
                        className={`px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                          isActive
                            ? "bg-indigo-50 dark:bg-indigo-950/60 text-[#605DEC] dark:text-indigo-400"
                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        {link.name}
                      </Link>
                    );
                  })}
                </nav>

                <div className="pt-4 border-t border-gray-200/60 dark:border-gray-800/80">
                  {!isLoggedIn ? (
                    <div className="flex flex-col gap-2.5">
                      <Link
                        href="/auth/signup"
                        onClick={closeAll}
                        className="w-full text-center py-2.5 bg-gradient-to-r from-[#605DEC] to-[#7B73F6] text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-500/20"
                      >
                        Sign up
                      </Link>
                      <Link
                        href="/auth/login"
                        onClick={closeAll}
                        className="w-full text-center py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      >
                        Log in
                      </Link>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2 rounded-xl bg-gray-50 dark:bg-gray-800/60">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#605DEC] to-[#8A85FF] flex items-center justify-center text-white font-bold text-xs overflow-hidden">
                          {user?.profile?.profile_picture ? (
                            <Image
                              src={user.profile.profile_picture}
                              alt="Profile"
                              width={36}
                              height={36}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span>{initials}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            {user?.first_name} {user?.last_name}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate max-w-[180px]">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <SignOutConfirmationModal
        isOpen={logout}
        onClose={() => setLogout(false)}
        onConfirm={() => {
          clearToken();
          clearUser();
          window.location.href = "/";
        }}
      />
    </>
  );
};

const DropdownLinks = ({ canAccessJudges, loading, onNavigate, onLogout }: any) => (
  <div className="space-y-0.5">
    {[
      { label: "View Profile", href: "/profile/detail", icon: User },
      { label: "Hacker Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Organization Hub", href: "/organizer", icon: Building2 },
    ].map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-[#605DEC] dark:hover:text-white transition-colors"
      >
        <item.icon className="w-3.5 h-3.5 text-gray-500" />
        <span>{item.label}</span>
      </Link>
    ))}
    {!loading && canAccessJudges && (
      <Link
        href="/judges"
        onClick={onNavigate}
        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/60 hover:text-[#605DEC] dark:hover:text-white transition-colors"
      >
        <Trophy className="w-3.5 h-3.5 text-gray-500" />
        <span>Judges Portal</span>
      </Link>
    )}
    <div className="border-t border-gray-100 dark:border-gray-700/60 my-1 pt-1">
      <button
        onClick={onLogout}
        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>Log Out</span>
      </button>
    </div>
  </div>
);
