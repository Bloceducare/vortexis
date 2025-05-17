import React from 'react';
import { motion } from 'framer-motion';
import Image, { StaticImageData } from 'next/image';
// import Logo from '@/assests/Logo.png';
import { ChevronRight, SettingsIcon } from 'lucide-react';
import Link from 'next/link';
// import SettingsIcon from '@/public/assets/icon/Services.svg';
// import SignoutIcon from '@/public/assets/icon/logout.svg';
import { Settings, LogOutIcon } from 'lucide-react';

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
  pathname: string;
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({
  sidebarItems,
  sidebarExpanded,
  toggleSidebar,
  pathname,
}) => {
  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarExpanded ? '250px' : '100px' }}
      className="fixed left-0 top-0 z-10 hidden h-screen flex-col bg-white lg:flex"
    >
      <button
        onClick={toggleSidebar}
        className="border-gray-200 hover:bg-gray-100 absolute -right-4 top-6 flex size-8 items-center justify-center rounded-full border bg-white"
      >
        <ChevronRight size={18} />
      </button>

      <div className="flex h-full flex-col">
        <div
          className={`border-b-gray-300 flex items-center justify-center border-b px-2 py-3 ${
            sidebarExpanded ? 'px-2' : ''
          }`}
        >
          {/* <Image src={Logo} alt="Logo" /> */}
        </div>

        <div className="flex w-full flex-col overflow-y-auto p-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center py-4 pl-4  hover:bg-[#FFF5DD] ${
                pathname === item.href
                  ? 'text-gray-900 rounded-l-md border-l-4 border-l-main bg-[#FFF5DD]'
                  : 'text-gray-600'
              }`}
            >
                <Image src={item.icon} alt={item.text} />

              {sidebarExpanded && <span className="ml-4">{item.text}</span>}
            </Link>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-4 p-2">
          <Link
            href="/admin/settings"
            className={`flex items-center py-4 pl-4 ${
              pathname === '/admin/settings'
                ? 'text-gray-900 rounded-l-md border-l-4 border-l-main bg-[#FFF5DD]'
                : 'text-gray-600'
            }`}
          >
            <button className="text-gray-600 flex items-center gap-3 pl-4">
              <Settings />

              {sidebarExpanded && <span>Settings</span>}
            </button>
          </Link>

          <button className="text-gray-600 flex items-center gap-3 pl-4">
            <LogOutIcon />

            {sidebarExpanded && <span className="text-red-500">Sign out</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default DesktopSidebar;