"use client";

import "../globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DesktopSidebar from "@/components/layouts/DesktopSidebar";
import Header from "@/components/layouts/Header";
import MobileSidebar from "@/components/layouts/MobileSidebar";
import {
  HomeIcon,
  ListOrderedIcon,
  LayoutDashboard,
  Trophy,
} from "lucide-react";
import Team from "@/public/assets/icon/team.svg";
import Dashboard from "@/public/assets/icon/community.svg";
import Community from "@/public/assets/icon/community.svg";
import Resourcess from "@/public/assets/icon/resource.svg";
import Submit from "@/public/assets/icon/iconoir_submit-document.svg";
import Champs from "@/public/assets/icon/tabler_flag-filled.svg";

import { Nunito, Nunito_Sans } from "next/font/google";

// import Hackathon_Navbar from "@/components/Navbar/hackathon-navbar";
import "../globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

const nunitoSan = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
});

const sidebarItems = [
  { icon: Dashboard, text: "Dashboard", href: "" },
  {
    icon: Champs,
    text: "My Hackathons",
    href: "",
  },
  {
    icon: Team,
    text: "Team Workspace",
    href: "",
  },

  {
    icon: Resourcess,
    text: "Resources",
    href: "",
  },
  {
    icon: Submit,
    text: "Submit Project",
    href: "",
  },
  {
    icon: Community,
    text: "Community",
    href: "",
  },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
        setIsMobile(true);
      } else {
        setIsMobile(false);
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
    <div
      className={`flex h-full min-h-screen gap-6 bg-[#FFFFFF] ${nunito.variable} ${nunitoSan.variable} antialiased`}
    >
      <DesktopSidebar
        sidebarExpanded={sidebarExpanded}
        sidebarItems={sidebarItems}
        toggleSidebar={toggleSidebar}
        pathname={pathname}
      />

      <MobileSidebar
        pathname={pathname}
        sidebarItems={sidebarItems}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div
        className={`flex-1 ${
          !sidebarExpanded ? "lg:ml-[120px]" : "lg:ml-[280px]"
        } transition-all duration-400 ease-in-out shadow-xl`}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="min-h-[calc(100vh-64px)] overflow-y-auto p-4 ">
          {children}
        </main>
      </div>
    </div>
  );
}
