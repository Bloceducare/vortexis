"use client";
import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
// import LocationIcon from '../assets/icons/LocationIcon';
// import NotificationIcon from '../assets/icons/NotificationIcon';
// import ProfileIcon from '../assets/icons/ProfileIcon';
// import Notification from '../Notifications/Notification';
// import SearchIcon from '../assets/icons/SearchIcon';
import { MenuIcon } from "lucide-react";
import Louise from "@/public/assets/icon/louise.svg";
import Alarm from "@/public/assets/icon/iconoir_bell-notification-solid.svg";
import SearchInput from "../ui/SearchInput";
// import Logo from '@/assests/Logo.png';
// import Flag from '@/assests/Flag.png';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  // const [showNotification, setShowNotification] = useState(false);

  const handleSearch = (query: string) => {
    console.log("Search for:", query);
  };
  return (
    <header className="border-gray-200 sticky right-0 top-0 z-50 h-20 w-[100%] border-b bg-white px-10 ">
      <div className="flex h-full items-center justify-between pr-4">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button type="button"
            aria-label="Toggle Menu"
            onClick={toggleSidebar}
            className="hover:bg-gray-100 rounded-md p-2 focus:outline-none lg:hidden"
          >
            <MenuIcon size={20} />
          </button>

          {/* Search Box */}
          <div className="px-6">
            <SearchInput onSearch={handleSearch} />
          </div>
        </div>

        <div className="flex items-center gap-10">
          <div>
            <Image src={Alarm} alt="alarm" />
          </div>

          <div className="flex items-center gap-2">
            <Image src={Louise} alt="profile" />
            <div>
              <p>Louise Thompson</p>
              <p className="text-sm text-[#4F5B67]">Organizer</p>
            </div>
          </div>
        </div>

        {/*
        <Image
          src={Logo} // Replace with your logo
          alt="Logo"
          width={120}
          height={32}
          className="block object-contain lg:hidden"
        /> */}
      </div>

      <AnimatePresence>
        {/* {showNotification && (
          <Notification onClose={() => setShowNotification(false)} />
        )} */}
      </AnimatePresence>
    </header>
  );
};

export default Header;
