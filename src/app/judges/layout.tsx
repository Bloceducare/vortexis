"use client";
import "../globals.css";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronsUpDown,
  LogOutIcon,
  Settings,
} from "lucide-react";
import Header from "@/components/layouts/Header";
import { Nunito, Nunito_Sans } from "next/font/google";
import { useAuthStore } from "@/store/useAuthStore";
import Resourcess from "@/public/assets/icon/resource.svg";
import Trophy from "@/public/assets/icon/Judges_NavLinks.svg";
import Champ from "@/public/assets/icon/judges_trophy.svg";
import Dashboard from "@/public/assets/icon/judgeDashboard.svg";
import Bell from "@/public/assets/icon/iconoir_bell-notification-solid.svg";
import { useJudgedHackathons } from "@/hooks/useJudges";
import { useHackathon } from "@/hooks/useHackathonDetails";



interface Hackathon {
  id: number;
  name: string;
  status: string;
  total_submission: string;
  due_date: string;
  reviews_completed: string;
}

interface SidebarItem {
  icon: string;
  text: string;
  href: string;
}

const sidebarItems = [
  { icon: Dashboard, text: "Dashboard", href: "/judges" },
  {
    icon: Champ,
    text: "My Reviews",
    href: "/judges/my-reviews",
  },
  {
    icon: Resourcess,
    text: "Evaluation Criteria",
    href: "/judges/evaluation-criteria",
  },
  {
    icon: Trophy,
    text: "Discussions",
    href: "/judges/collaboration",
  },
  {
    icon: Bell,
    text: "Notifications",
    href: "/judges/notifications",
  },
];

export default function JudgesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const clearToken = useAuthStore((state) => state.clearToken);

  // Mock hackathons data
  // const hackathons: Hackathon[] = [
  //   {
  //     id: 1,
  //     name: "Arbitrum hackers",
  //     status: "active",
  //     total_submission: "12",
  //     due_date: "5/15/2025",
  //     reviews_completed: "5/12",
  //   },
  //   {
  //     id: 2,
  //     name: "Stellar hackquest",
  //     status: "active",
  //     total_submission: "12",
  //     due_date: "5/15/2025",
  //     reviews_completed: "5/12",
  //   },
  //   {
  //     id: 3,
  //     name: "Stylus hackathon",
  //     status: "active",
  //     total_submission: "12",
  //     due_date: "5/15/2025",
  //     reviews_completed: "5/12",
  //   },
  // ];

  const { hackathons, loading, error } = useJudgedHackathons();

  // Get selected hackathon from URL
  const selectedHackathon = useMemo(() => {
    const segments = pathname.split("/");
    const index = segments.indexOf("judges");
    return segments[index + 1] || "";
  }, [pathname]);

  // const selectedHackathonName =hackathons.map
  const selectedHackathonName =
    hackathons?.find((h) => String(h.id) === String(selectedHackathon))
      ?.title || "Select Hackathon";

  const handleHackathonSelect = (id: string | undefined) => {
    if (!id) return;
    const newPath = `/judges/dashboard/${id}`;

    if (newPath !== pathname) {
      router.push(newPath);
    }
    setIsDropdownOpen(false);
    if (isMobile) setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    clearToken();
    localStorage.removeItem("access_token");
    router.push("/");
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarExpanded(false);
        setIsMobile(true);
        setMobileMenuOpen(false);
      } else {
        setIsMobile(false);
        setMobileMenuOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarExpanded(!sidebarExpanded);
    }
  };
  return (
    <div className={`flex min-h-screen bg-[#f5f5f5] relative  antialiased`}>
      {/* Mobile overlay */}
      {isMobile && mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 bg-opacity-40 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: isMobile ? "-100%" : 0, width: 250 }}
        animate={{
          x: isMobile ? (mobileMenuOpen ? 0 : "-100%") : 0,
          width: isMobile ? 250 : sidebarExpanded ? 250 : 100,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="flex flex-col bg-white border-r text-gray-700 fixed h-screen z-50"
      >
        {/* Logo */}
        <div className="text-blue-700 text-3xl font-bold text-center py-6">
          {sidebarExpanded || isMobile ? "Vortexis" : "V"}
        </div>

        {/* Desktop toggle button */}
        {!isMobile && (
          <button
            onClick={toggleSidebar}
            className="absolute right-0 top-8 bg-white border border-gray-300 rounded-full shadow-md w-10 h-10 flex items-center justify-center cursor-pointer"
          >
            <motion.div
              animate={{ rotate: sidebarExpanded ? 0 : 180 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronLeft className="w-7 h-7 text-gray-600" />
            </motion.div>
          </button>
        )}

        {/* Mobile close button */}
        {isMobile && (
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full border bg-white hover:bg-gray-100"
          >
            <ChevronLeft size={18} />
          </button>
        )}

        <nav className="flex flex-col gap-2 mt-4 px-6">
          {/* Dashboard - Always visible */}
          <Link
            href="/judges"
            className={`mb-2 flex gap-4 items-center py-4 pl-2 pr-4 hover:text-gray-900 ${
              pathname === "/judges"
                ? "text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]"
                : "text-gray-600"
            }`}
          >
            <Image src={Dashboard} alt="dashboard" width={24} height={24} />
            <span
              className={`${sidebarExpanded || isMobile ? "inline" : "hidden"}`}
            >
              Dashboard
            </span>
          </Link>

          {/* Hackathon Selector */}
          {(sidebarExpanded || isMobile) && (
            <div className="relative mb-2 z-50">
              <label className="block text-sm font-medium mb-1 text-gray-500">
                Select Hackathon
              </label>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full p-2 border rounded flex justify-between items-center text-sm text-gray-700 bg-white"
              >
                {selectedHackathonName}
                <ChevronsUpDown className="w-4 h-4 text-gray-600 ml-2" />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-1 w-full bg-white border rounded shadow origin-top z-[100]"
                  >
                    {hackathons?.length > 0 ? (
                      hackathons.map((h) => (
                        <li
                          key={h.id}
                          onClick={() => handleHackathonSelect(String(h.id))}
                          className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        >
                          {h.title}
                        </li>
                      ))
                    ) : (
                      <div className="p-4 text-center text-sm text-gray-600">
                        <p className="text-[#a09393]">No hackathons assigned</p>
                      </div>
                    )}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Sidebar Items - Only show after hackathon selection */}
          {selectedHackathon && (
            <>
              {sidebarItems.slice(1).map((item, index) => {
                // Update href for dynamic routing based on selected hackathon
                const dynamicHref =
                  item.href === "/judges/my-reviews"
                    ? `/judges/my-reviews`
                    : item.href === "/judges/evaluation-criteria"
                    ? `/judges/evaluation-criteria`
                    : item.href === "/judges/collaboration"
                    ? `/judges/collaboration`
                    : item.href === "/judges/notifications"
                    ? `/judges/notifications`
                    : item.href;

                const isActive = pathname === dynamicHref;

                return (
                  <Link
                    key={index}
                    href={dynamicHref}
                    className={`flex gap-4 items-center py-4 pl-2 pr-4 hover:bg-[#F7F7FB] ${
                      isActive
                        ? "text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]"
                        : "text-gray-600"
                    }`}
                  >
                    <Image
                      src={item.icon}
                      alt={item.text}
                      width={24}
                      height={24}
                    />
                    <span
                      className={`${
                        sidebarExpanded || isMobile ? "inline" : "hidden"
                      }`}
                    >
                      {item.text}
                    </span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        {/* Footer */}
        <div className="mt-auto py-6 flex flex-col gap-4 px-6">
          <Link
            href="/profile/edit"
            className={`flex items-center gap-3 hover:bg-[#F7F7FB] py-2 px-2 rounded ${
              pathname === "/profile/edit"
                ? "text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]"
                : "text-gray-600"
            }`}
          >
            <Settings size={20} />
            {(sidebarExpanded || isMobile) && <span>Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 text-red-500 hover:bg-[#F7F7FB] py-2 px-2 rounded"
          >
            <LogOutIcon size={20} />
            {(sidebarExpanded || isMobile) && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div
        className={`flex-1 ${
          !isMobile ? (sidebarExpanded ? "lg:ml-[280px]" : "lg:ml-[120px]") : ""
        } transition-all duration-400 ease-in-out`}
      >
        <div className="bg-white mb-2">
          <Header toggleSidebar={toggleSidebar} />
        </div>
        <main className="min-h-[calc(100vh-64px)] w-[98%] rounded-lg shadow bg-white overflow-y-auto p-4 mt-4">
          {children}
        </main>
      </div>
    </div>
  );
}
