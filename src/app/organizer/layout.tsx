"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronsUpDown,
  LogOutIcon,
  Settings,
  Moon,
  Sun,
  Building2,
  X,
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Dash from "@/public/assets/icon/material-symbols_dashboard.svg";
import { Trophy, Users, Upload, Gavel } from "lucide-react";
import Header from "@/components/layouts/Header";
import useOrganizer from "@/hooks/useOrganizers";
import { useHackathonStore } from "@/store/useHackathonStore";
import { SignOutConfirmationModal } from "@/components/signOutModal";
import { useAuthStore } from "@/store/useAuthStore";
import { slugify } from "@/lib/utils";
import { useThemeStore } from "@/store/useThemeStore";
import { useOrganizationStore } from "@/store/useOrganizationStore";
import NewOrganization from "./components/NewOrganization";


interface OrganizerLayoutProps {
  children: React.ReactNode;
}



export default function OrganizerLayout({ children }: OrganizerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [logout, setLogout] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { getHackathons, getAllOrganization } = useOrganizer();
  const setHackathons = useHackathonStore((state) => state.setHackathons);
  const clearToken = useAuthStore((state) => state.clearToken);

  const setClickedOrganization = useOrganizationStore((state) => state.setOrganization);

  const [showOrgSelectModal, setShowOrgSelectModal] = useState(false);
  const [showNoOrgModal, setShowNoOrgModal] = useState(false);
  const [showNewOrgModal, setShowNewOrgModal] = useState(false);

  const { data: orgsData, isLoading: orgsLoading } = getAllOrganization;
  const OpenModal = () => {
    setLogout(true);
  };

const navLinks = [
  { label: "Manage", path: "hackathon", icon: Trophy },
  { label: "Participants", path: "participants", icon: Users },
  { label: "Submissions", path: "submission", icon: Upload },
  { label: "Judges", path: "judges", icon: Gavel },
];

  const confirmLogout = () => {
    clearToken();
    window.location.href = "/";
  };

  const { data } = getHackathons();

  useEffect(() => {
    if (data) {
      setHackathons(data);
    }
  }, [data, setHackathons]);

  const hackathons = useHackathonStore((state) => state.hackathons);
  const { setActiveHackathon } = useHackathonStore();

const selectedHackathonSlug = useMemo(() => {
  const segments = pathname.split("/");
  const index = segments.indexOf("organizer");
  return segments[index + 1] || "";
}, [pathname]);

 const selectedHackathonName = useMemo(() => {
  if (!hackathons) return "Select Hackathon";
  
  const match = hackathons.find((h) => slugify(h.title ?? "") === selectedHackathonSlug);
  
  return match ? match.title : "Select Hackathon";
}, [hackathons, selectedHackathonSlug]);

  const handleSelect = (h: any) => {
    if (!h) return;
    const segments = pathname.split("/");
    const index = segments.indexOf("organizer");
    const currentSubpath =
      segments.length > index + 2 ? segments[index + 2] : "";
      setActiveHackathon(h);
               const slug = slugify(h.title);

    const newPath = currentSubpath
      ? `/organizer/${slug}/${currentSubpath}`
      : `/organizer/${slug}/hackathon`;

    if (newPath !== pathname) {
      router.push(newPath);
    }
    setIsDropdownOpen(false);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleCreateHackathonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (orgsLoading) return;

    const orgs = orgsData?.results || [];
    if (orgs.length > 0) {
      setShowOrgSelectModal(true);
    } else {
      setShowNoOrgModal(true);
    }
  };

  const handleOrgSelect = (org: any) => {
    setClickedOrganization(org);
    setShowOrgSelectModal(false);
    const slug = slugify(org.name);
    router.push(`/organizer/create-hackathon/${slug}`);
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);



  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen((prev) => !prev);
    } else {
      setSidebarExpanded((prev) => !prev);
    }
  };

  const goToHome = () => {
    router.push("/hackathon")
  }

  return (
    <div className="flex min-h-screen bg-[#f5f5f5] dark:bg-gray-900 relative transition-colors">
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-40 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <motion.aside
        initial={{ x: isMobile ? "-100%" : 0, width: 250 }}
        animate={{
          x: isMobile ? (mobileMenuOpen ? 0 : "-100%") : 0,
          width: isMobile ? 250 : sidebarExpanded ? 250 : 100,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 fixed h-screen z-50 transition-colors"
      >
        <div className="text-blue-700 dark:text-blue-400 text-3xl font-bold text-center py-6 cursor-pointer" onClick={goToHome}>
          {sidebarExpanded || isMobile ? "Vortexis" : "V"}
        </div>

        {!isMobile && !pathname.includes("/organizer/create-hackathon") && (
          <button
            onClick={toggleSidebar}
            className="absolute right-0 top-8 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer transition-colors"
          >
            <motion.div
              animate={{ rotate: sidebarExpanded ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-7 h-7 text-gray-600 dark:text-gray-400" />
            </motion.div>
          </button>
        )}

        <nav className="flex flex-col gap-2 mt-4 px-6">
          <Link
            href="/organizer"
            className={`mb-2 flex gap-4 items-center py-4 pl-2 pr-4 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-[#F7F7FB] dark:hover:bg-gray-700 ${
              pathname === "/organizer"
                ? "text-gray-900 dark:text-gray-100 border-r-4 border-[#605DEC] bg-[#F7F7FB] dark:bg-gray-700"
                : "text-gray-600 dark:text-gray-300"
            } transition-colors`}
          >
            <Image src={Dash} alt="dash" width={24} height={24} />
            <span
              className={`${sidebarExpanded || isMobile ? "inline" : "hidden"}`}
            >
              Dashboard
            </span>
          </Link>

          {/* Hackathon selector */}
          <div className="relative mb-6 z-50">
            <label className="block text-sm font-medium mb-1 text-gray-500 dark:text-gray-400">
              Select Hackathon
            </label>
            <button
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full p-2 border border-gray-200 cursor-pointer dark:border-gray-700 rounded flex justify-between items-center text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 transition-colors"
            >
              {selectedHackathonName}
              <ChevronsUpDown className="w-4 h-4 text-gray-600 dark:text-gray-400 ml-2" />
            </button>

      <AnimatePresence>
  {isDropdownOpen && (
    <motion.ul
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="absolute left-0 top-full mt-1 w-full 
                 bg-white dark:bg-gray-800 
                 border border-gray-200 dark:border-gray-700 
                 rounded shadow origin-top z-[100] 
                 transition-colors
                 max-h-60 overflow-y-auto"
    >
      {hackathons?.length > 0 ? (
        hackathons.map((h) => (
          <li
            key={h.id}
            onClick={() => handleSelect(h)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 
                       cursor-pointer text-sm 
                       text-gray-700 dark:text-gray-300 
                       transition-colors"
          >
            {h.title}
          </li>
        ))
      ) : (
        <div className="p-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p className="text-[#a09393]">No hackathon created</p>
          <button
            onClick={handleCreateHackathonClick}
            className="inline-block mt-3 px-3 py-2 
                       text-white bg-blue-600 hover:bg-blue-700 
                       rounded text-sm font-medium transition cursor-pointer"
          >
            + Create new hackathon
          </button>
        </div>
      )}
    </motion.ul>
  )}
</AnimatePresence>

          </div>

          {/* Nav links */}
          {selectedHackathonSlug && !pathname.includes("/organizer/create-hackathon") && (
            <div>
              {navLinks.map((link, index) => {
                const fullPath = `/organizer/${selectedHackathonSlug}/${link.path}`;
                const isActive =
                  pathname === fullPath || pathname?.includes(link.path);
                    const Icon = link.icon;


                return (
                  <Link
                    key={index}
                    href={fullPath}
                    className={`flex items-center py-4 pl-2 pr-4 gap-4 rounded hover:bg-[#F7F7FB] dark:hover:bg-gray-700 ${
                      isActive
                        ? "text-gray-900 dark:text-gray-100 border-r-4 border-[#605DEC] bg-[#F7F7FB] dark:bg-gray-700"
                        : "text-gray-600 dark:text-gray-300"
                    } transition-colors`}
                  >
                    <Icon
        size={20}
        className={`transition-colors duration-200 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      />
                    <span
                      className={`${
                        sidebarExpanded || isMobile ? "inline" : "hidden"
                      } transition-all duration-200`}
                    >
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="mt-auto py-6 flex flex-col gap-4 px-6">
          <button
            onClick={toggleDarkMode}
            className="flex items-center gap-3 hover:bg-[#F7F7FB] dark:hover:bg-gray-700 py-2 px-2 rounded text-gray-600 dark:text-gray-300 transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun size={20} className="text-yellow-500" />
            ) : (
              <Moon size={20} />
            )}
            <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <Link
            href="/profile/detail"
            className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:bg-[#F7F7FB] dark:hover:bg-gray-700 py-2 px-2 rounded transition-colors"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button
            className="flex items-center gap-3 text-red-500"
            onClick={OpenModal}
          >
            <LogOutIcon size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {logout && (
        <SignOutConfirmationModal
          onClose={() => setLogout(false)}
          onConfirm={confirmLogout}
          isOpen
        />
      )}

      {/* Organization Interception Modals */}
      <AnimatePresence>
        {showOrgSelectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xl max-w-lg w-full overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Select Organization
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Choose under which organization to create the hackathon
                  </p>
                </div>
                <button
                  onClick={() => setShowOrgSelectModal(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 max-h-96 overflow-y-auto space-y-3">
                {orgsData?.results?.map((org: any) => (
                  <button
                    key={org.id}
                    onClick={() => handleOrgSelect(org)}
                    className="w-full flex items-center gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-gray-700/30 transition-all text-left group cursor-pointer"
                  >
                    {org.logo ? (
                      <img
                        src={org.logo}
                        alt={org.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100 dark:border-gray-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-100/70 dark:bg-blue-900/40 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                        {org.name}
                      </h4>
                      {org.tagline ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                          {org.tagline}
                        </p>
                      ) : org.description ? (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                          {org.description}
                        </p>
                      ) : null}
                    </div>
                  </button>
                ))}
              </div>

              {/* Footer */}
              <div className="flex justify-end gap-3 p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                <button
                  onClick={() => setShowOrgSelectModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors border border-gray-200 dark:border-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showNoOrgModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-2xl max-w-sm w-full p-6 text-center"
            >
              <div className="mx-auto w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center text-amber-600 dark:text-amber-400 mb-4 animate-bounce">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                No Organization Found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                You must have an organization before you can create a hackathon. Let's create your first organization now!
              </p>
              <div className="flex flex-col gap-2 mt-6">
                <button
                  onClick={() => {
                    setShowNoOrgModal(false);
                    setShowNewOrgModal(true);
                  }}
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition-all cursor-pointer"
                >
                  + Create Organization
                </button>
                <button
                  onClick={() => setShowNoOrgModal(false)}
                  className="w-full py-2.5 px-4 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors border border-gray-200 dark:border-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {showNewOrgModal && (
          <NewOrganization
            onClose={() => setShowNewOrgModal(false)}
            type="new"
          />
        )}
      </AnimatePresence>

      {/* Main content */}
      <div
        className={`flex-1 ${
          !isMobile ? (sidebarExpanded ? "lg:ml-[280px]" : "lg:ml-[120px]") : ""
        } transition-all duration-400 ease-in-out`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-1 md:p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
