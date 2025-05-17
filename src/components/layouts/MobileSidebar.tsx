import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Settings, LogOutIcon } from 'lucide-react';

import { ChevronLeft } from 'lucide-react';
// import Logo from '@/assests/Logo.png';
import React from 'react';
// import { usePathname } from 'next/navigation';

// import HomeIcon from '../assets/icons/HomeIcon';
// import ProductIcon from '../assets/icons/ProductIcon';
// import OrderIcon from '../assets/icons/OrderIcon';
// import CartIcon from '../assets/icons/CartIcon';
// import SupportIcon from '../assets/icons/SupportIcon';

interface SidebarItem {
  icon: React.ReactNode;
  text: string;
  href: string;
}

interface MobileSidebarProps {
  sidebarItems: SidebarItem[];
  pathname: string;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({
  sidebarItems,
  pathname,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  return (
    <>
      {/* Mobile Menu Overlay */}
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

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.aside
            initial={{ x: -240 }}
            animate={{ x: 0 }}
            exit={{ x: -240 }}
            transition={{ ease: 'easeOut' }}
            className="border-gray-200 fixed left-0 top-0 z-50 h-full w-64 border-r bg-white px-4 md:hidden"
          >
            <div className="flex h-full flex-col">
              <div className="flex h-16 items-center justify-between px-4">
                <div className="h-8 w-full">
                  {/* <Image
                    src={Logo}
                    alt="Logo"
                    width={120}
                    height={32}
                    className="object-contain"
                  /> */}
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="border-gray-200 hover:bg-gray-100 absolute -right-5 top-5 flex size-8 items-center justify-center rounded-full border bg-white"
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
                        ? 'border-l-5 border-main bg-[#FFF5DD]'
                        : 'hover:bg-[#FFF5DD]'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="text-gray-500">{item.icon}</span>
                    <span
                      className={` ml-3 whitespace-nowrap ${
                        pathname === item.href ? 'text-main' : 'text-icon'
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
                    pathname === '/admin/settings'
                      ? 'bg-gray-100'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-gray-500">
                    <Settings />
                  </span>
                  <span className="text-gray-700 ml-3">Settings</span>
                </Link>
                <Link
                  href="/logout"
                  className="hover:bg-gray-50 flex items-center rounded-lg  px-4 py-3"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="text-gray-500">
                    <LogOutIcon />
                  </span>
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
