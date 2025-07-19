"use client";

import React, { FC } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Settings, LogOutIcon, ChevronLeft } from "lucide-react";

interface SidebarItem {
  icon: string;
  text: string;
  href: string;
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
            className="fixed left-0 top-0 z-50 h-full w-3/4 max-w-64 border-r bg-white px-4 md:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="h-8 w-full">
                  <span className="text-lg font-bold">Web3Bridge</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute right-2 top-4 flex size-8 items-center justify-center rounded-full border bg-white hover:bg-gray-100"
                  aria-label="Close mobile menu"
                >
                  <ChevronLeft size={18} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto py-4">
                {sidebarItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className={`mb-1 flex items-center rounded-lg px-4 py-3 ${
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
                ))}
              </div>
              <div className="mt-auto">
                <Link
                  href="/admin/settings"
                  className={`mb-1 flex items-center rounded-lg px-4 py-3 ${
                    pathname === "/admin/settings"
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
