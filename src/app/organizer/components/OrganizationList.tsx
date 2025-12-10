import React, { useState, useMemo } from 'react';
import useOrganizer from '@/hooks/useOrganizers';
import { ChevronLeft, ChevronRight, Edit, PlusSquareIcon, Globe, MapPin, Link2, Building2, Trophy } from 'lucide-react';
import HtmlContent from '@/components/ui/HtMLContent';
import Verified from "@/public/assets/verified.svg";
import Image from 'next/image';
import SearchInput from "@/components/ui/SearchInput";
import ParticipantImage from "@/public/assets/famicons_people-outline.svg";
import { useRouter } from 'next/navigation';
import Time from '@/public/assets/Time Outline Icon 1.svg'
import NewOrganization from './NewOrganization';
import AddModerator from './AddModerator';
import { motion } from 'framer-motion';


interface OrgProps {
  onClose: () => void;
  organizationId: number | null;
}

function OrganizationList({ onClose, organizationId }: OrgProps) {
  const { getOrganizationHackathon, getOrganizationById, } = useOrganizer();
  const id = String(organizationId);
  const router = useRouter();
  const [showOptionsOrg, setShowOptionsOrg] = useState({
    edit: false,
    addModerator: false
  });

  const { data: orgData, isLoading: orgLoading, isError: orgError } = getOrganizationById(id!);
  const { data: hackathons, isLoading, isError } = getOrganizationHackathon(id!);


  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 6;

 
  if (orgError || isError) {
    return <div className="p-6 text-center text-red-500">Failed to load organization data.</div>;
  }

  if (isLoading || orgLoading) {
    return (
      <section className="p-6 animate-pulse">
  
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-gray-300 dark:bg-gray-700" />
  
            <div className="space-y-3">
              <div className="h-6 w-48 rounded-md bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-32 rounded-md bg-gray-200 dark:bg-gray-600" />
              <div className="h-4 w-24 rounded-md bg-gray-200 dark:bg-gray-600" />
            </div>
          </div>
  
          <div className="h-10 w-20 rounded-lg bg-gray-300 dark:bg-gray-700" />
        </div>
  
        <div className="space-y-2 mb-10">
          <div className="h-4 w-full rounded-md bg-gray-200 dark:bg-gray-600" />
          <div className="h-4 w-11/12 rounded-md bg-gray-200 dark:bg-gray-600" />
          <div className="h-4 w-10/12 rounded-md bg-gray-200 dark:bg-gray-600" />
        </div>
  
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-48 rounded-md bg-gray-300 dark:bg-gray-700" />
          <div className="h-6 w-32 rounded-md bg-gray-200 dark:bg-gray-600" />
        </div>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="p-4 border rounded-xl shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col"
            >
              <div className="w-full h-40 rounded-lg mb-4 bg-gray-300 dark:bg-gray-700" />
  
              <div className="h-5 w-3/4 rounded-md mb-2 bg-gray-300 dark:bg-gray-700" />
              <div className="h-4 w-full rounded-md mb-1 bg-gray-200 dark:bg-gray-600" />
              <div className="h-4 w-5/6 rounded-md mb-4 bg-gray-200 dark:bg-gray-600" />
  
              <div className="h-3 w-1/2 rounded-md bg-gray-200 dark:bg-gray-600 self-start" />
            </div>
          ))}
        </div>
  
      </section>
    );
  }
    const allHackathons = hackathons?.hackathons || [];
  const totalHackathons = hackathons?.hackathons_count || 0;


const filteredHackathons = !searchQuery.trim()
  ? allHackathons
  : allHackathons.filter((hackathon: any) =>
      hackathon.title.toLowerCase().includes(searchQuery.toLowerCase())
    );



  const totalPages = Math.ceil(filteredHackathons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHackathons = filteredHackathons.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => currentPage < totalPages && setCurrentPage((p) => p + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage((p) => p - 1);
 
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); 
  };


  return (
    <div className="p-6">
  
         
      <div className='flex justify-between items-center w-full mb-4'>
        <div className='flex items-center gap-4'>
          {/* Logo */}
          {orgData?.logo ? (
            <img 
              src={orgData.logo} 
              alt={orgData.name}
              className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <Building2 className="w-8 h-8 text-indigo-400" />
            </div>
          )}

          <div>
            <h2 className="text-3xl font-bold flex gap-2 items-center">
              {orgData?.name}  {orgData?.is_approved && (  <Image src={Verified} alt="verify" /> )}
            </h2>
            
            {orgData?.tagline && (
              <p className="text-sm text-indigo-600 font-medium mt-1">
                {orgData.tagline}
              </p>
            )}

            <p className="text-sm text-gray-600 mt-1">
              Total Hackathons: <span className="font-medium">{totalHackathons}</span>
            </p>
          </div>
        </div>

        <div className='flex gap-5 items-center'>
          <a
            className="cursor-pointer"
            title="Add new moderator"
            onClick={() => setShowOptionsOrg({ ...showOptionsOrg, addModerator: true })}
          >
            <PlusSquareIcon />
          </a>

          <a
            className="cursor-pointer"
            title="Edit organization details"
            onClick={() => setShowOptionsOrg({ ...showOptionsOrg, edit: true })}
          >
            <Edit />
          </a>
        </div>
      </div>

      {/* Organization Info Section */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {orgData?.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-indigo-500" />
              <span>{orgData.location}</span>
            </div>
          )}

          {orgData?.website && (
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-indigo-500" />
              <a 
                href={orgData.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:underline"
              >
                {orgData.website}
              </a>
            </div>
          )}

          {orgData?.custom_url && (
            <div className="flex items-center gap-2">
              <Link2 size={16} className="text-indigo-500" />
              <span className="text-gray-600">{orgData.custom_url}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Moderators: <span className="font-medium">{orgData?.moderators?.length ?? 0}</span>
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2 mb-6">
        <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">Description</h1>
        <p className="text-gray-700 leading-relaxed dark:text-gray-300">
          {orgData?.description || 'No description available for this organization.'}
        </p>
      </div>

      {/* About Section */}
      {orgData?.about && (
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-semibold text-[#171717] dark:text-white">About</h1>
          <p className="text-gray-700 leading-relaxed dark:text-gray-300">
            {orgData.about}
          </p>
        </div>
      )}

      {/* Search and Start Button */}
      {orgData?.is_approved && ( 
        <section className="flex justify-between items-center mb-5">
          <div className="w-1/2">
            <SearchInput onSearch={handleSearch} className="bg-white" />
          </div>

          <button className="border rounded-full px-3 py-1 bg-[#605DEC] text-white text-sm font-semibold cursor-pointer hover:bg-[#4e48c9] transition flex items-center gap-2" onClick={() => router.push(`/organizer/create-hackathon/${organizationId}`)}>
            <b className="text-2xl mb-1">+</b> Start hackathon
          </button>
        </section>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">
          {orgData?.name} Hackathons 
        </h3>

        {totalPages > 1 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border cursor-pointer ${
                currentPage === 1 ? 'text-gray-300 border-gray-200' : 'text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              <ChevronLeft size={18} />
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border cursor-pointer ${
                currentPage === totalPages
                  ? 'text-gray-300 border-gray-200'
                  : 'text-gray-700 hover:bg-gray-100 border-gray-300'
              }`}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentHackathons.length > 0 ? (
          currentHackathons.map((hackathon: any) => {
            const today = new Date();
            const endDate = new Date(hackathon.end_date);
            const diff = endDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));
            const hasEnded = diff < 0;

            return (
              <div
                key={hackathon.id}
                onClick={() => router.push(`/organizer/${hackathon.id}/hackathon`)}
                className="p-4 border rounded-xl hover:shadow-lg transition bg-white cursor-pointer flex flex-col justify-between dark:bg-gray-800"
              >
                      <div
        className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden group cursor-pointer"
      >
        {hackathon.banner_image && hackathon.banner_image.trim() !== "" ? (
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            src={hackathon.banner_image}
            alt={hackathon.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Trophy className="w-16 h-16 text-primary/30" />
          </div>
        )}
        </div>


                <h4 className="text-lg font-medium mb-4">{hackathon.title}</h4>

                <div className="text-sm text-gray-600 mb-10">
                  <HtmlContent html={hackathon.description?.slice(0, 250)} />
                </div>

                <div className="flex items-center mt-3 gap-3">
                  <p
                    className={`bg-[#F2F1FD] rounded-full px-3 py-1 text-xs font-medium text-[#717171] dark:bg-gray-700 dark:text-gray-300`}
                  >
                    <Image
                      src={Time}
                      alt="TimeIcon"
                      className="inline mr-2"
                    />
                    {hasEnded ? "Ended" : `${daysLeft} days left`}
                  </p>

                  <p className="bg-[#F2F1FD] rounded-full px-3 py-1 text-xs text-[#605DEC] dark:bg-gray-700 dark:text-gray-300">
                    <Image
                      src={ParticipantImage}
                      alt="participant"
                      className="inline mr-1"
                    />
                    {hackathon?.participants_count}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500">No hackathons found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg border cursor-pointer ${
              currentPage === 1
                ? 'text-gray-300 border-gray-200'
                : 'text-gray-700 hover:bg-gray-100 border-gray-300'
            }`}
          >
            Previous
          </button>

          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded-lg border cursor-pointer ${
              currentPage === totalPages
                ? 'text-gray-300 border-gray-200'
                : 'text-gray-700 hover:bg-gray-100 border-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {showOptionsOrg.edit && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-lg relative">
            <NewOrganization
              onClose={() => setShowOptionsOrg({ ...showOptionsOrg, edit: false })}
              type="edit"
              existingData={orgData}
            />
          </div>
        </div>
      )}

      {showOptionsOrg.addModerator && (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-lg relative">
            <AddModerator 
              onClose={() => setShowOptionsOrg({ ...showOptionsOrg, addModerator: false })}
              orgName={orgData?.name}
              orgId={id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationList;

