'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getCountries, Country } from '@/app/api/country/getCountries';
import { useParams } from 'next/navigation';
import useOrganizer from '@/hooks/useOrganizers';
import { ChevronDown, ChevronUp } from 'lucide-react';
import TableSkeleton from '@/components/TableSkeleton';





function Participants() {
  const SubmissionPerPage = 8;
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { useParticipants } = useOrganizer();
  const [filteredParticipants, setFilteredParticipants] = useState<
    {
      id: number;
      title: string;
      phone_no: string;
      email: string;
      team: string;
      country: string;
      status: string;
    }[]
  >([]);

  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;

  const { data, isLoading, isError } = useParticipants(hackathon_id);

  const totalPages = Math.ceil(
    (data ?? []).filter((sub: any) =>
      sub.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / SubmissionPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1);
  };

  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);

  useEffect(() => {
    let filtered = data ?? [];

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(
        (sub: any) =>
          sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (sortOrder && sortOrder.trim() !== '') {
      filtered = filtered.filter(
        (sub: any) => sub.country?.toLowerCase() === sortOrder.toLowerCase()
      );
    }

    const startIndex = (currentPage - 1) * SubmissionPerPage;
    const endIndex = startIndex + SubmissionPerPage;
    setFilteredParticipants(filtered.slice(startIndex, endIndex));
  }, [searchTerm, sortOrder, currentPage, data]);

  const start = (currentPage - 1) * SubmissionPerPage + 1;
  const end = Math.min(currentPage * SubmissionPerPage, filteredParticipants.length);

    if (isLoading) return  <TableSkeleton />;


  if (isError) return <p className="p-10 text-lg text-red-500">Failed to load participants.</p>;

  return (
    <section className="bg-white px-10 rounded-2xl py-5 mb-10 shadow-lg">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-[#605DEC]">Participant Management</h1>
        <p className="text-[#212121]">View and manage event participants</p>
      </div>

      <div className="mb-6 mt-16 xl:px-10 xl:mr-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="flex justify-between items-center px-5">
            <div>
              <h1 className="font-semibold text-2xl">All Participants</h1>
              <p className="text-[#16C098] mt-2">Active Participants</p>
            </div>

            <div className="flex items-center justify-between gap-5">
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-[#F9FBFF] w-[55%]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z"
                    stroke="#7E7E7E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M21 20.9984L16.65 16.6484"
                    stroke="#7E7E7E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Search by name, team or email"
                  className="w-full max-w-md outline-none border-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <div className="relative w-[90%]">
  <div
    className="flex items-center justify-between bg-[#F9FBFF] px-3 py-2 rounded-lg gap-4 cursor-pointer"
    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
  >
    <p className="text-[#7E7E7E] text-sm">Sort by</p>
    <div className="flex justify-between items-center w-[70%]">
      <span className="font-semibold text-sm text-[#212121]">
        {sortOrder || 'By country'}
      </span>
      {isDropdownOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
    </div>
  </div>

  {isDropdownOpen && (
    <ul className="absolute left-0 right-0 z-10 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
      <li
        onClick={() => {
          setSortOrder('');
          setCurrentPage(1);
          setIsDropdownOpen(false);
        }}
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
      >
        By country
      </li>
      {countries.map((country, idx) => (
        <li
          key={idx}
          onClick={() => {
            setSortOrder(country.name);
            setCurrentPage(1);
            setIsDropdownOpen(false);
          }}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
        >
          {country.name}
        </li>
      ))}
    </ul>
  )}
</div>

            </div>
          </div>

          <section>
            <table className="table-auto w-full mt-5">
              <thead>
                <tr className="border-b border-gray-200 text-[#B5B7C0]">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Team</th>
                  <th className="px-4 py-2 text-left">Phone Number</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Country</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>

              {filteredParticipants.length === 0 ? (
    <tr>
      <td colSpan={6} className="text-center py-10 text-gray-500">
        No participants found.
      </td>
    </tr>
  ) : (
                filteredParticipants.map((sub, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 border-b border-[#EEEEEE]"
                  >
                    <td className="px-4 py-7">
                      <div>
                        <h1 className="text-[#212121]">{sub.title}</h1>
                      </div>
                    </td>
                    <td className="px-4 py-7"> {sub.team}</td>
                    <td className="px-4 py-7">
                      <div>
                        <h1 className="text-[#212121]">{sub.phone_no}</h1>
                      </div>
                    </td>
                    <td className="px-4 py-7"> {sub.email}</td>
                    <td className="px-2 py-7 text-[#292D32] font-medium">
                      {sub.country}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-5 py-2 rounded-lg font-semibold ${
                          sub.status === 'Active'
                            ? 'bg-[#16C09861] text-[#008767] border-[#00B087] border'
                            : 'border-[#DF0404] border bg-[#FFC5C5] text-[#DF0404]'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    </tr>
    ))
  )}
              </tbody>
            </table>

            <div className="flex justify-between items-center mt-5 px-5">
              <p className="text-[#727272]">
                Showing data {end === 0 ? '0' : start} to {end} of{' '}
                {(data ?? []).length} entries
              </p>

              <nav className="flex justify-center items-center gap-3 mt-5">
                <p
                  onClick={handlePrev}
                  className="border px-4 rounded-lg cursor-pointer bg-[#F5F5F5] border-[#EEEEEE] py-2 text-[#404B52] font-semibold"
                >
                  {'<'}
                </p>
                <ul className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handlePageChange(index + 1)}
                        className={`px-4 py-2 rounded-lg ${
                          currentPage === index + 1
                            ? 'bg-[#5932EA] text-white'
                            : 'bg-[#F5F5F5] text-[#404B52] border border-[#EEEEEE] hover:bg-[#5932EA] hover:text-white'
                        }`}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                </ul>
                <p
                  onClick={handleNext}
                  className="border px-4 rounded-lg cursor-pointer bg-[#F5F5F5] border-[#EEEEEE] py-2 text-[#404B52] font-semibold"
                >
                  {'>'}
                </p>
              </nav>
            </div>
          </section>
        </motion.div>
      </div>
    </section>
  );
}

export default Participants;
