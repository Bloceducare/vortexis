"use client";

import React, { FC, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Settings,
  LogOutIcon,
  ChevronLeft,
  ChevronDown,
  File,
} from "lucide-react";
import { useRouter } from "next/navigation";

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

interface MobileSidebarProps {
  sidebarItems: SidebarItem[];
  pathname: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const MobileSidebar: FC<MobileSidebarProps> = ({
  sidebarItems,
  pathname,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const router = useRouter();
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleHackathonClick = (hackathonId: number) => {
    router.push(`/judges/submission-review/${hackathonId}`);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ ease: "easeOut", duration: 0.3 }}
            className="fixed left-0 top-0 z-50 h-full w-full max-w-[95%] border-r bg-white px-2 md:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="h-8 w-full">
                  <span className="text-lg font-bold">Vortexis</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute right-0 top-4 flex size-8 items-center justify-center rounded-full border bg-white hover:bg-gray-100"
                  aria-label="Close mobile menu"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {sidebarItems.map((item, index) => (
                  <div key={index} className="mb-1">
                    {item.dropdown ? (
                      <>
                        <div
                          onClick={toggleDropdown}
                          className={`flex items-center justify-between rounded-lg px-4 py-3 cursor-pointer ${
                            pathname === item.href
                              ? "border-l-4 border-[#605DEC] bg-[#F7F7FB]"
                              : "hover:bg-[#F7F7FB]"
                          }`}
                        >
                          <div className="flex items-center">
                            <Image
                              src={item.icon}
                              alt={item.text}
                              width={24}
                              height={24}
                              className="object-contain"
                            />
                            <span
                              className={`ml-3 whitespace-nowrap ${
                                pathname === item.href
                                  ? "text-[#605DEC]"
                                  : "text-gray-600"
                              }`}
                            >
                              {item.text}
                            </span>
                          </div>
                          <ChevronDown
                            className={`text-sm cursor-pointer transition-transform duration-200 ${
                              dropdownOpen ? "rotate-180" : ""
                            }`}
                            size={16}
                          />
                        </div>

                        {/* Mobile Dropdown Menu */}
                        <AnimatePresence>
                          {dropdownOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="bg-gray-50 border-l-4 border-[#605DEC] ml-4 mb-2 rounded-b-lg"
                            >
                              {hackathons.length > 0 ? (
                                <div className="py-2">
                                  {hackathons.map((hackathon) => (
                                    <div
                                      key={hackathon.id}
                                      onClick={() =>
                                        handleHackathonClick(hackathon.id)
                                      }
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
                                              {hackathon.reviews_completed}{" "}
                                              reviews
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
                                    <File
                                      size={32}
                                      className="mx-auto text-gray-400"
                                    />
                                  </div>
                                  <p className="text-sm text-gray-500">
                                    No hackathons found
                                  </p>
                                  <p className="text-xs text-gray-400 mt-1">
                                    You haven't been assigned to any hackathons
                                    yet
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center rounded-lg px-4 py-3 ${
                          pathname === item.href
                            ? "border-l-4 border-[#605DEC] bg-[#F7F7FB]"
                            : "hover:bg-[#F7F7FB]"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Image
                          src={item.icon}
                          alt={item.text}
                          width={24}
                          height={24}
                          className="object-contain"
                        />
                        <span
                          className={`ml-3 whitespace-nowrap ${
                            pathname === item.href
                              ? "text-[#605DEC]"
                              : "text-gray-600"
                          }`}
                        >
                          {item.text}
                        </span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-auto">
                <Link
                  href="/profile/edit"
                  className={`mb-1 flex items-center rounded-lg px-4 py-3 ${
                    pathname === "/profile/edit"
                      ? "border-l-4 border-[#605DEC] bg-[#F7F7FB]"
                      : "hover:bg-[#F7F7FB]"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings size={24} />
                  <span className="text-gray-700 ml-3">Settings</span>
                </Link>
                <Link
                  href="/logout"
                  className="hover:bg-[#F7F7FB] flex items-center rounded-lg px-4 py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogOutIcon size={24} />
                  <span className="ml-3 text-red-500">Sign Out</span>
                </Link>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSidebar;
