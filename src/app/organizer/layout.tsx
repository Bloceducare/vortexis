'use client';

import '../globals.css';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import DesktopSidebar from '@/components/layouts/DesktopSidebar';
import Header from '@/components/layouts/Header';
import MobileSidebar from '@/components/layouts/MobileSidebar';
import { HomeIcon, ListOrderedIcon, LayoutDashboard, Trophy,  } from 'lucide-react';
import Team from '@/public/assets/icon/team.svg'
import Dashboard from '@/public/assets/icon/community.svg'
import Community from '@/public/assets/icon/community.svg'
import Resourcess from '@/public/assets/icon/resource.svg'
import Submit from '@/public/assets/icon/iconoir_submit-document.svg'
import Champs from '@/public/assets/icon/tabler_flag-filled.svg'



const sidebarItems = [
  { icon: Dashboard, text: 'Dashboard', href: '/organizer' },
  {
    icon: Champs,
    text: 'My Hackathons',
    href: '/organizer/hackathon',
  },
  {
    icon: Team,
    text: 'Team Workspace',
    href: '/organizer/workspaces',
  },

  {
    icon: Resourcess,
    text: 'Resources',
    href: '/organizer/resources',
  },
  {
    icon: Submit,
    text: 'Submit Project',
    href: '/organizer/project',
  },
  {
    icon: Community,
    text: 'Community',
    href: '/organizer/community',
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
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  const isAuthPage = pathname?.includes('/admin/auth/');

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

      <div className="flex-1 lg:ml-[280px]">
        <Header toggleSidebar={toggleSidebar} />

        <main className="min-h-[calc(100vh-64px)] overflow-y-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
