"use client";

import React, { FC, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ChevronRight, Settings, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { SignOutConfirmationModal } from "../signOutModal";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { useAuthStore } from "@/store/useAuthStore";

interface SidebarItem {
  icon: string;
  text: string;
  href: string;
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

  const clearToken = useAuthStore((state) => state.clearToken);

  const handleLogout = () => {
   clearToken()

    // Close the modal
    setShowSignOutModal(false);
    // Redirect to home page after logout
    router.push("/");
    // Close the sidebar if it's open
    // onClose();
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
            <Link
              key={index}
              href={item.href}
              className={`flex items-center py-4 pl-10 hover:bg-[#F7F7FB] ${
                pathname === item.href
                  ? "text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]"
                  : "text-gray-600"
              }`}
            >
              <Image
                src={item.icon}
                alt={item.text}
                width={24}
                height={24}
                className="object-contain"
              />
              {sidebarExpanded && <span className="ml-4">{item.text}</span>}
            </Link>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-4 py-2">
          {settingPage && (
            <Link
              href={settingPage}
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
