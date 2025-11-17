"use client";
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/store/useUserStore";
import { usePathname } from "next/navigation";
import { NotificationDropdown } from "@/components/NotificationDropdown";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { SignOutConfirmationModal } from "../signOutModal";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();
  const [logout, setLogout] = useState(false);

  const clearToken = useAuthStore((state) => state.clearToken);
  const clearUser = useUserStore((state) => state.clearUser);

  const handleLogout = () => {
    clearToken();
    clearUser();
    setIsLoggedIn(false);
    router.push("/");
  };

  const user = useUserStore((state) => state.user);

  const handleSearch = (query: string) => {
    console.log("Search for:", query);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Determine current dashboard from route
  const dashboardMap: Record<string, string> = {
    "/organizer": "Organizer",
    "/judges": "Judge",
    "/dashboard": "Hacker",
  };

  const currentDashboard =
    Object.entries(dashboardMap).find(([path]) =>
      pathname.startsWith(path)
    )?.[1] || "Dashboard";

  // ✅ User initials
  const initials = `${user?.first_name?.[0] ?? ""}${
    user?.last_name?.[0] ?? ""
  }`;

  // ✅ Avatar background color logic
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
    <header className="border-gray-200 dark:border-gray-700 md:max-w-full sm:max-w-64 sticky right-0 top-0 z-50 h-20 w-full border-b bg-white dark:bg-gray-800 md:px-10 px-5 transition-colors">
      <div className="flex h-full items-center justify-between md:pr-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            aria-label="Toggle Menu"
            onClick={toggleSidebar}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md p-2 focus:outline-none lg:hidden"
          >
            <MenuIcon size={20} />
          </button>

          {/* Search Box */}
          <div className="px-6 md:block hidden">
            {/* <SearchInput onSearch={handleSearch} /> */}
          </div>
        </div>

        <div
          className="flex items-center gap-5 md:gap-10 relative"
          ref={dropdownRef}
        >
          <NotificationDropdown />
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
                <p className="text-sm text-[#4F5B67]">{currentDashboard}</p>
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
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-10"
                  />

                  {/* Dropdown Menu */}
                  <motion.div
                    key="dropdown"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-16 right-0 w-48 bg-white shadow-lg rounded-lg border z-50"
                  >
                    <ul className="py-2 text-sm text-gray-700 list-none">
                      <li>
                        <Link
                          href="/profile/detail"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          View Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/organizer"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Organization
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Hacker
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/judges"
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Judges
                        </Link>
                      </li>
                      <li>
                        <p
                          onClick={() => setLogout(true)}
                          className="block px-4 py-2 hover:bg-gray-100 cursor-pointer"
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
      </div>

      <SignOutConfirmationModal
        isOpen={logout}
        onClose={() => setLogout(false)}
        onConfirm={() => {
          handleLogout();
          setLogout(false);
        }}
      />
    </header>
  );
};

export default Header;
