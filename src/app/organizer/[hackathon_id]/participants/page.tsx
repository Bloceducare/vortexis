"use client"
import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ParticipantsData } from '../../utils'
import { getCountries, Country } from '@/app/api/country/getCountries'

function Participants() {
  const SubmissionPerPage = 8
  const [countries, setCountries] = useState<Country[]>([]);
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState('')
  const [filteredParticpants, setFilteredParticpants] = useState<{
    id: number,
    title: string,
    phone_no:  string,
    email: string,
    team: string,
    country: string,
    status: string
  }[]>([])

  const totalPages = Math.ceil(
    ParticipantsData.filter(sub =>
      sub.title.toLowerCase().includes(searchTerm.toLowerCase())
    ).length / SubmissionPerPage
  )

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }


  const start = (currentPage - 1) * SubmissionPerPage + 1;
    const end = Math.min(currentPage * SubmissionPerPage, filteredParticpants.length);

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1)
  }
  useEffect(() => {
    getCountries().then(setCountries).catch(console.error);
  }, []);
  useEffect(() => {
    let filtered = ParticipantsData;
  
    // Search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(sub =>
        sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  
    // Country filter
    if (sortOrder && sortOrder.trim() !== "") {
      filtered = filtered.filter(sub =>
        sub.country?.toLowerCase() === sortOrder.toLowerCase()
      );
    }
  
    const startIndex = (currentPage - 1) * SubmissionPerPage;
    const endIndex = startIndex + SubmissionPerPage;
    setFilteredParticpants(filtered.slice(startIndex, endIndex));
  }, [searchTerm, sortOrder, currentPage, ParticipantsData]);
  
  
  return (
    <>
     <section className="bg-white px-10 rounded-2xl py-5 mb-10 shadow-lg">

         <div className='space-y-3'>
        <h1 className='text-3xl font-bold text-[#605DEC]'>Participant Management</h1>
        <p className='text-[#212121]'>View and manage event participants</p>
      </div>


      <div className="mb-6  mt-16 xl:px-10 xl:mr-20">

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
              onChange={e => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="flex items-center bg-[#F9FBFF] px-3 py-2 rounded-lg gap-4 w-[40%]">
            <p className="text-[#7E7E7E] text-sm">Sort by :</p>
             <select
          value={sortOrder}
          onChange={e => {
            setSortOrder(e.target.value);
            setCurrentPage(1);
          }}
          className="font-semibold text-sm w-[70%] outline-none cursor-pointer"
        >
          <option value="">By country</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country.name}>
              {country.name}
            </option>
          ))}
        </select>
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
            {filteredParticpants.map((sub, index) => (
              <tr
                key={index}
                className="hover:bg-gray-50 border-b border-[#EEEEEE]"
              >
                <td className="px-4 py-7">
                  <div>
                    <h1 className="text-[#212121]">{sub.title}</h1>
                    <p className="text-[#727272] font-medium">
                     
                    </p>
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
            ))}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-5 px-5">
        <p className='text-[#727272]'>Showing data { end === 0 ? "0" : start } to {end}  of {ParticipantsData.length} entries</p>

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

    </>

  )
}

export default Participants