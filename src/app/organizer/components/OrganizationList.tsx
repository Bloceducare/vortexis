import React, { useState, useMemo } from 'react';
import useOrganizer from '@/hooks/useOrganizers';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import HtmlContent from '@/components/ui/HtMLContent';
import Verified from "@/public/assets/verified.svg";
import Image from 'next/image';
import SearchInput from "@/components/ui/SearchInput";
import ParticipantImage from "@/public/assets/famicons_people-outline.svg";
import { useRouter } from 'next/navigation';
import Time from '@/public/assets/Time Outline Icon 1.svg'

interface OrgProps {
  onClose: () => void;
  organizationId: number | null;
}




function OrganizationList({ onClose, organizationId }: OrgProps) {
  const { getOrganizationHackathon, getOrganizationById } = useOrganizer();
  const id = String(organizationId);
  const router = useRouter();

  const { data: orgData, isLoading: orgLoading, isError: orgError } = getOrganizationById(id!);
  const { data: hackathons, isLoading, isError } = getOrganizationHackathon(id!);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const itemsPerPage = 6;

 
  if (orgError || isError) {
    return <div className="p-6 text-center text-red-500">Failed to load organization data.</div>;
  }

  if (isLoading || orgLoading) { return  <section className="p-6 animate-pulse"> <div className="flex items-center justify-between mb-6"> <div className="flex items-center gap-4"> <div className="w-16 h-16 bg-gray-300 rounded-xl" /> <div className="space-y-3"> <div className="h-6 w-48 bg-gray-300 rounded-md" /> <div className="h-4 w-32 bg-gray-200 rounded-md" /> <div className="h-4 w-24 bg-gray-200 rounded-md" /> </div> </div> <div className="h-10 w-20 bg-gray-300 rounded-lg" /> </div> <div className="space-y-2 mb-10"> <div className="h-4 w-full bg-gray-200 rounded-md" /> <div className="h-4 w-11/12 bg-gray-200 rounded-md" /> <div className="h-4 w-10/12 bg-gray-200 rounded-md" /> </div> <div className="flex justify-between items-center mb-4"> <div className="h-6 w-48 bg-gray-300 rounded-md" /> <div className="h-6 w-32 bg-gray-200 rounded-md" /> </div> <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"> {[...Array(6)].map((_, index) => ( <div key={index} className="p-4 border rounded-xl bg-white shadow-sm flex flex-col" > <div className="w-full h-40 bg-gray-300 rounded-lg mb-4" /> <div className="h-5 w-3/4 bg-gray-300 rounded-md mb-2" /> <div className="h-4 w-full bg-gray-200 rounded-md mb-1" /> <div className="h-4 w-5/6 bg-gray-200 rounded-md mb-4" /> <div className="h-3 w-1/2 bg-gray-200 rounded-md self-start" /> </div> ))} </div> </section>  }
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
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {orgData?.logo && (
            <img src={orgData.logo} alt={orgData.name} className="w-16 h-16 rounded-xl object-cover" />
          )}
          <div>
            <h2 className="text-3xl font-bold flex gap-2">
              {orgData?.name}  {orgData.is_approved && (  <Image src={Verified} alt="verify" /> )}
            </h2>
            <p className="text-gray-500">{orgData?.category}</p>
            <p className="text-sm text-gray-600 mt-1">
              Total Hackathons: <span className="font-medium">{totalHackathons}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold text-[#171717]">Description</h1>
        <p className="text-gray-700 leading-relaxed mb-8">
          {orgData?.description || 'No description available for this organization.'}
        </p>
      </div>

      {/* Search and Start Button */}
      {orgData.is_approved && ( 
           <section className="flex justify-between items-center mb-5">
        <div className="w-1/2">
          <SearchInput onSearch={handleSearch} className="bg-white" />
        </div>

     <button className="border rounded-full px-3 py-1 bg-[#605DEC] text-white text-sm font-semibold cursor-pointer hover:bg-[#4e48c9] transition flex items-center gap-2" onClick={() => router.push(`/organizer/create-hackathon/${organizationId}`)}>
          <b className="text-2xl mb-1">+</b> Start hackathon
        </button>
      </section>
 )}



      {/* Hackathons Section */}
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
          className="p-4 border rounded-xl hover:shadow-lg transition bg-white cursor-pointer flex flex-col justify-between "
        >
          <img
            src={hackathon.banner_image || "/placeholder.png"}
            alt={hackathon.title}
            className="w-full h-40 object-cover rounded-lg mb-3"
          />

          <h4 className="text-lg font-medium mb-4">{hackathon.title}</h4>

          <div className="text-sm text-gray-600 mb-10">
            <HtmlContent html={hackathon.description?.slice(0, 250)} />
          </div>

          <div className="flex items-center mt-3 gap-3">
            <p
              className={`bg-[#F2F1FD] rounded-full px-3 py-1 text-xs font-medium text-[#717171]`}
            >
               <Image
                src={Time}
                alt="TimeIcon"
                className="inline mr-2"
              />
              {hasEnded ? "Ended" : `${daysLeft} days left`}
            </p>

            {/* 👥 Participants */}
            <p className="bg-[#F2F1FD] rounded-full px-3 py-1 text-xs text-[#605DEC]">
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


      {/* Pagination */}
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
    </div>
  );
}

export default OrganizationList;

