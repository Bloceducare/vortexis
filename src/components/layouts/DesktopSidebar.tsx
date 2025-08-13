"use client";

import React, { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ChevronRight,
  Settings,
  LogOutIcon,
  ChevronDown,
  File,
} from "lucide-react";
import Link from "next/link";
import { SignOutConfirmationModal } from "../signOutModal";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarItem {
  icon: string;
  text: string;
  href: string;
  dropdown?: boolean;
}

interface Hackathon {
  id: number;
  name: string;
  status: string;
  total_submission: string;
  due_date: string;
  reviews_completed: string;
}

interface DesktopSidebarProps {
  sidebarItems: SidebarItem[];
  sidebarExpanded: boolean;
  toggleSidebar: () => void;
  settingPage?: string;
  pathname: string;
}

const DesktopSidebar: FC<DesktopSidebarProps> = ({
  sidebarItems,
  sidebarExpanded,
  toggleSidebar,
  settingPage,
  pathname,
}) => {
  const router = useRouter();
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const hackathons: Hackathon[] = [
    {
      id: 1,
      name: "Arbitrum hackers",
      status: "active",
      total_submission: "12",
      due_date: "5/15/2025",
      reviews_completed: "5/12",
    },
    {
      id: 2,
      name: "Stellar hackquest",
      status: "active",
      total_submission: "12",
      due_date: "5/15/2025",
      reviews_completed: "5/12",
    },
    {
      id: 3,
      name: "Stylus hackathon",
      status: "active",
      total_submission: "12",
      due_date: "5/15/2025",
      reviews_completed: "5/12",
    },
  ];

  // const hackathons: Hackathon[] = [];

  const clearToken = useAuthStore((state) => state.clearToken);

  const handleLogout = () => {
    clearToken();
    setShowSignOutModal(false);
    router.push("/");
  };

  const toggleDropdown = () => {
    if (sidebarExpanded) {
      setDropdownOpen(!dropdownOpen);
    }
  };

  const handleHackathonClick = (hackathonId: number) => {
    router.push(`/judges/submission-review/${hackathonId}`);
    setDropdownOpen(false);
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarExpanded ? "250px" : "100px" }}
      className="fixed left-0 top-0 z-10 hidden h-screen flex-col bg-white lg:flex"
    >
      <button
        type="button"
        aria-label="Toggle Sidebar"
        onClick={toggleSidebar}
        className="border-gray-200 hover:bg-gray-100 absolute -right-4 top-5 text-blue-700 flex size-8 items-center justify-center rounded-full border bg-white"
      >
        <ChevronRight
          size={18}
          className={sidebarExpanded ? "rotate-180" : ""}
        />
      </button>
      <div className="flex h-full flex-col gap-y-2">
        <div
          className={`flex text-3xl font-semibold text-blue-700 items-center justify-center px-2 py-4 ${
            sidebarExpanded ? "py-2" : ""
          }`}
        >
          Vortexis
        </div>
        <div className="flex w-full flex-col overflow-y-auto gap-y-2">
          {sidebarItems.map((item, index) => (
            <div key={index} className="relative">
              <div
                className={`py-4 pl-5 hover:bg-[#F7F7FB] ${
                  pathname === item.href
                    ? "text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]"
                    : "text-gray-600"
                } flex relative items-center justify-between`}
              >
                {item.dropdown ? (
                  <div
                    onClick={toggleDropdown}
                    className="relative flex items-center w-full cursor-pointer"
                  >
                    <div className="flex items-center cursor-pointer">
                      <Image
                        src={item.icon}
                        alt={item.text}
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      {sidebarExpanded && (
                        <span className="ml-4">{item.text}</span>
                      )}
                    </div>
                    {sidebarExpanded && (
                      <ChevronDown
                        className={`absolute right-1 text-sm cursor-pointer transition-transform duration-200 ${
                          dropdownOpen ? "rotate-180" : ""
                        }`}
                        size={20}
                      />
                    )}
                  </div>
                ) : (
                  <Link href={item.href} className="flex items-center w-full">
                    <Image
                      src={item.icon}
                      alt={item.text}
                      width={24}
                      height={24}
                      className="object-contain"
                    />
                    {sidebarExpanded && (
                      <span className="ml-4">{item.text}</span>
                    )}
                  </Link>
                )}
              </div>

              {/* Dropdown Menu */}
              {item.dropdown && sidebarExpanded && (
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="bg-gray-50 border-l-4 border-[#605DEC] ml-5"
                    >
                      {hackathons.length > 0 ? (
                        <div className="py-2">
                          {hackathons.map((hackathon) => (
                            <div
                              key={hackathon.id}
                              onClick={() => handleHackathonClick(hackathon.id)}
                              className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {hackathon.name}
                                  </p>
                                  <div className="flex items-center mt-1 space-x-2">
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1"></span>
                                      {hackathon.status}
                                    </span>
                                  </div>
                                  <div className="mt-1 text-xs text-gray-500">
                                    <span className="mr-3">
                                      Due: {hackathon.due_date}
                                    </span>
                                    <span className="text-green-600">
                                      {hackathon.reviews_completed} reviews
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="px-4 py-6 text-center">
                          <div className="text-gray-400 mb-2">
                            <File size={32} className="mx-auto text-gray-400" />
                          </div>
                          <p className="text-sm text-gray-500">
                            No hackathons found
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            You haven't been assigned to any hackathons yet
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-4 py-2">
          {settingPage && (
            <Link
              href="/profile/edit"
              className={`flex items-center py-4 pl-10 ${
                pathname === settingPage
                  ? "text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]"
                  : "text-gray-600"
              }`}
            >
              <Settings size={24} />
              {sidebarExpanded && <span className="ml-4">Settings</span>}
            </Link>
          )}
          <button
            onClick={() => setShowSignOutModal(true)}
            className="text-gray-600 flex items-center cursor-pointer gap-3 pl-10"
          >
            <LogOutIcon size={24} />
            {sidebarExpanded && <span className="text-red-500">Sign out</span>}
          </button>
        </div>
      </div>
      <SignOutConfirmationModal
        isOpen={showSignOutModal}
        onClose={() => setShowSignOutModal(false)}
        onConfirm={handleLogout}
      />
    </motion.aside>
  );
};

export default DesktopSidebar;
