"use client";

import "../globals.css";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import DesktopSidebar from "@/components/layouts/DesktopSidebar";
import Header from "@/components/layouts/Header";
import MobileSidebar from "@/components/layouts/MobileSidebar";

import Team from "@/public/assets/icon/team.svg";
// import Dashboard from "@/public/assets/icon/community.svg";
import Community from "@/public/assets/icon/community.svg";
import Resourcess from "@/public/assets/icon/resource.svg";
import Submit from "@/public/assets/icon/iconoir_submit-document.svg";
import Trophy from "@/public/assets/icon/Judges_NavLinks.svg";
import Champ from "@/public/assets/icon/judges_trophy.svg";
import Dashboard from "@/public/assets/icon/judgeDashboard.svg";

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
  { icon: Dashboard, text: "Dashboard", href: "/judges" },

  {
    icon: Champ,
    text: "Assigned Hackathons",
    href: "/",
  },

  {
    icon: Team,
    text: "Submissions To Review",
    href: "/judges",
  },

  {
    icon: Resourcess,
    text: "Evaluation Criteria",
    href: "",
  },
  {
    icon: Submit,
    text: "Judge Notes",
    href: "",
  },
  {
    icon: Trophy,
    text: "Discussions",
    href: "judges/collaboration",
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
      className={`flex h-full min-h-screen max-w-full gap-6 bg-[#f5f5f5] ${nunito.variable} ${nunitoSan.variable} antialiased`}
    >
      <DesktopSidebar
        sidebarExpanded={sidebarExpanded}
        sidebarItems={sidebarItems}
        toggleSidebar={toggleSidebar}
        settingPage=""
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
        }  transition-all duration-400 ease-in-out `}
      >
        <div className="bg-white mb-2">
          <Header toggleSidebar={toggleSidebar} />
        </div>

        <main className="min-h-[calc(100vh-64px)] w-[98%] rounded-lg shadow bg-white overflow-y-auto p-4 mt-4  ">
          {children}
        </main>
      </div>
    </div>
  );
}
