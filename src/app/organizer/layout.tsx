'use client';

import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useMemo, useState, useEffect } from 'react';
import { ChevronLeft, ChevronsUpDown, LogOutIcon, Settings } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import Trophy from '@/public/assets/icon/game-icons_trophy-cup.svg';
import Team from "@/public/assets/icon/team.svg";
import Judges from "@/public/assets/icon/tabler_hammer.svg";
import Submit from "@/public/assets/icon/Clock.svg";
import Dash from '@/public/assets/icon/material-symbols_dashboard.svg';
import Header from '@/components/layouts/Header';
import useOrganizer from '@/hooks/useOrganizers';
import { useHackathonStore } from '@/store/useHackathonStore';

interface OrganizerLayoutProps {
  children: React.ReactNode;
}

// const mockHackathons = [
//   { id: '1', name: 'AI Hackathon' },
//   { id: '2', name: 'Web3 Hack' },
//   { id: '3', name: 'Green Tech Sprint' },
// ];

const navLinks = [
  { label: 'Manage', path: 'hackathon', icon: Trophy },
  { label: 'Participants', path: 'participants', icon: Team },
  { label: 'Submissions', path: 'submission', icon: Submit },
  { label: 'Judges', path: 'judges', icon: Judges },
];

export default function OrganizerLayout({ children }: OrganizerLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const { getHackathons } = useOrganizer()
  const setHackathons = useHackathonStore(state => state.setHackathons);


  const { data, isLoading, error } = getHackathons()
// ✅ Update Zustand only when data changes
useEffect(() => {
  if (data) {
    setHackathons(data);
  }
}, [data, setHackathons]);  const hackathons = useHackathonStore((state) => state.hackathons);

  const selectedHackathon = useMemo(() => {
    const segments = pathname.split('/');
    const index = segments.indexOf('organizer');
    return segments[index + 1] || '';
  }, [pathname]);

  const selectedHackathonName =
    hackathons?.find(h => h.id === selectedHackathon)?.title || 'Select Hackathon';

    const handleSelect = (id: string | undefined) => {
      if (!id) return;
    
      const segments = pathname.split('/');
      const index = segments.indexOf('organizer');
      
      // Check if there's a subpath after the hackathon ID
      const currentSubpath = segments.length > index + 2 ? segments[index + 2] : '';
    
      // Build the new path
      const newPath = currentSubpath 
        ? `/organizer/${id}/${currentSubpath}` 
        : `/organizer/${id}/hackathon`; // default subpage fallback
    
      if (newPath !== pathname) {
        router.push(newPath);
      }
    
      setIsDropdownOpen(false);
    };
    

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: 250 }}
        animate={{ width: sidebarExpanded ? 250 : 100 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:flex flex-col bg-white border-r text-gray-700 fixed h-screen z-50"
      >
        <div className="text-blue-700 text-3xl font-bold text-center py-6">
          {sidebarExpanded ? 'Vortexis' : 'V..'}
        </div>

        {/* Sidebar Toggle Arrow Button */}
        <button
          onClick={toggleSidebar}
          className="absolute right-0 top-8 bg-white border border-gray-300 rounded-full shadow-md w-10 h-10 flex items-center justify-center z-50 cursor-pointer"
        >
          <motion.div
            animate={{ rotate: sidebarExpanded ? 0 : 180 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronLeft className="w-7 h-7 text-gray-600" />
          </motion.div>
        </button>

        <nav className="flex flex-col gap-2 mt-4 px-6">
          <Link
            href="/organizer"
            className={`mb-2 flex gap-4 items-center py-4 pl-2 pr-4 hover:text-gray-900 ${
              pathname === '/organizer'
                ? 'text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]'
                : 'text-gray-600'
            }`}
          >
            <Image
              src={Dash}
              alt="dash"
              width={sidebarExpanded ? 24 : 20}
              height={sidebarExpanded ? 24 : 20}
            />
            <span className={`${sidebarExpanded ? 'inline' : 'hidden'}`}>Dashboard</span>
          </Link>

          {/* Custom Hackathon Selector */}
          <div className="relative mb-6 z-50">
            <label className="block text-sm font-medium mb-1 text-gray-500">
              Select Hackathon
            </label>

            <button
              onClick={() => setIsDropdownOpen(prev => !prev)}
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
              hackathons?.map(h => (
                <li
                  key={h.id}
                  onClick={() => handleSelect(h.id)}
                  className="p-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                >
                  {h.title}
                </li>
              ))
            ) : (
              <div className="p-4 text-center text-sm text-gray-600">
                <p className='text-[#a09393] '>No hackathon created</p>
                <a
                  href="/organizer/create-hackathon"
                  className="inline-block mt-3 px-1 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  + Create new hackathon
                </a>
              </div>
            )}
          </motion.ul>
        )}
      </AnimatePresence>

          </div>

          {navLinks.map((link, index) => {
            const fullPath = `/organizer/${selectedHackathon}/${link.path}`;
            const isActive = pathname === fullPath || pathname?.includes(link.path);

            return (
              <Link
                key={index}
                href={fullPath}
                className={`flex items-center py-4 pl-2 pr-4 gap-4 rounded hover:bg-[#F7F7FB] ${
                  isActive
                    ? 'text-gray-900 border-r-4 border-[#605DEC] bg-[#F7F7FB]'
                    : 'text-gray-600'
                }`}
              >
                <Image
                  src={link.icon}
                  alt={link.label}
                  width={24}
                  height={24}
                  className="object-contain"
                />
                <span className={`${sidebarExpanded ? 'inline' : 'hidden'} transition-all duration-200`}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="mt-auto py-6 flex flex-col gap-4 px-6">
          <Link href="/organizer/settings" className="flex items-center gap-3 text-gray-600">
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <button className="flex items-center gap-3 text-red-500">
            <LogOutIcon size={20} />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={`flex-1 ${
          sidebarExpanded ? 'lg:ml-[280px]' : 'lg:ml-[120px]'
        } transition-all duration-400 ease-in-out`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}


