import React from "react";
import { motion } from "framer-motion";
import Image, { StaticImageData } from "next/image";
// import Logo from '@/assests/Logo.png';
import { ChevronRight, SettingsIcon } from "lucide-react";
import Link from "next/link";
// import SettingsIcon from '@/public/assets/icon/Services.svg';
// import SignoutIcon from '@/public/assets/icon/logout.svg';
import { Settings, LogOutIcon } from "lucide-react";
// import { Button } from "../ui/button";

// import HomeIcon from '../assets/icons/HomeIcon';
// import ProductIcon from '../assets/icons/ProductIcon';
// import OrderIcon from '../assets/icons/OrderIcon';
// import CartIcon from '../assets/icons/CartIcon';
// import SupportIcon from '../assets/icons/SupportIcon';
// import { usePathname } from 'next/navigation';
// import { useEffect, useState } from 'react';

interface SidebarItem {
  icon: StaticImageData;
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

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  sidebarItems,
  sidebarExpanded,
  toggleSidebar,
  settingPage,
  pathname,
}) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarExpanded ? "250px" : "100px" }}
      className="fixed left-0 top-0 z-10 hidden h-screen flex-col bg-white w-20 lg:flex"
    >
      <button type="button"
        aria-label="Toggle Sidebar"
        onClick={toggleSidebar}
        className="border-gray-200 hover:bg-gray-100 absolute -right-4 top-5 text-blue-700 flex size-8 items-center justify-center rounded-full border bg-white"
      >
        <ChevronRight size={18} />
      </button>

      <div className="flex h-full flex-col gap-y-2">
        <div
          className={` flex text-3xl font-semibold text-blue-700 items-center justify-center px-2 py-4 ${
            sidebarExpanded ? "py-2" : ""
          }`}
        >
          {/* <Image src={Logo} alt="Logo" /> */}
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
              <Image src={item.icon} alt={item.text} />

              {sidebarExpanded && <span className="ml-4">{item.text}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 py-2">
          {settingPage && <Link
            href={settingPage}
            className={`flex items-center py-4 pl-4 ${
              pathname === settingPage
                ? "text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]"
                : "text-gray-600"
            }`}
          >
            <button className="text-gray-600 flex items-center gap-3 pl-4">
              <Settings />

              {sidebarExpanded && <span>Settings</span>}
            </button>
          </Link>}

          <button className="text-gray-600 flex items-center gap-3 pl-10">
            <LogOutIcon />

            {sidebarExpanded && <span className="text-red-500">Sign out</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default DesktopSidebar;
