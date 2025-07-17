"use client";

import "../globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DesktopSidebar from "@/components/layouts/DesktopSidebar";
import Header from "@/components/layouts/Header";
import MobileSidebar from "@/components/layouts/MobileSidebar";
import Team from "@/public/assets/icon/team.svg";
import Judges from "@/public/assets/icon/tabler_hammer.svg";
import Analytics from "@/public/assets/icon/Info.svg";
import Submit from "@/public/assets/icon/Clock.svg";
import Champs from "@/public/assets/icon/game-icons_trophy-cup.svg";
import Dash from '@/public/assets/icon/material-symbols_dashboard.svg'

const sidebarItems = [
  { icon: Dash, text: "Dashboard", href: "/organizer" },
  {
    icon: Champs,
    text: "Manage Hackathons",
    href: "/organizer/workspaces",
  },

  {
    icon: Team,
    text: "Participants",
    href: "/organizer/participants",
  },
  {
    icon: Submit,
    text: "Submissions",
    href: "/organizer/submission",
  },
  {
    icon: Analytics,
    text: "Analytics",
    href: "/organizer/analytics",
  },
  {
    icon: Judges,
    text: "Judges",
    href: "/organizer/judges",
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

  const isAuthPage = pathname?.includes("/admin/auth/");

  if (isAuthPage) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen gap-6 bg-[#f5f5f5]">
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
          !sidebarExpanded ? "lg:ml-[120px]" : "lg:ml-[270px]"
        } transition-all duration-400 ease-in-out`}
      >
        <Header toggleSidebar={toggleSidebar} />

        <main className="min-h-[calc(100vh-64px)] overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}