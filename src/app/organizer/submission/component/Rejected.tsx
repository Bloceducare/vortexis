import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
// import { Input } from '@/components/ui/Input'
import { Submission } from '../../utils'

function Rejected() {
    const SubmissionPerPage = 8;
      const [searchTerm, setSearchTerm] = useState('')
   const [sortOrder, setSortOrder] = useState('newest')
  const [filteredSubmissions, setFilteredSubmissions] = useState<{
   id: number
   title: string
   categoty: string
   members: string
   team: string
   status: string
   date: string
 }[]>([])

    const rejectedSubmissions = Submission.filter(item => item.status === "Rejected");

     const totalPages = Math.ceil(
       rejectedSubmissions.filter(sub =>
         sub.title.toLowerCase().includes(searchTerm.toLowerCase())
       ).length / SubmissionPerPage
     )

       const [currentPage, setCurrentPage] = useState(1);

      useEffect(() => {
        const filtered = rejectedSubmissions.filter(sub =>
          sub.title.toLowerCase().includes(searchTerm.toLowerCase())
        )

        const sorted = filtered.sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
        })

        const startIndex = (currentPage - 1) * SubmissionPerPage
        const endIndex = startIndex + SubmissionPerPage
        setFilteredSubmissions(sorted.slice(startIndex, endIndex))
      }, [searchTerm, sortOrder, currentPage])


      const handlePageChange = (page: number) => {
       setCurrentPage(page)
     }

    const handleNext = () => {
      if (currentPage < totalPages) {
        handlePageChange(currentPage + 1);
      }
    };

    const handlePrev = () => {
      if (currentPage > 1) {
        handlePageChange(currentPage - 1);
      }
    };

    const start = (currentPage - 1) * SubmissionPerPage + 1;
    const end = Math.min(currentPage * SubmissionPerPage, filteredSubmissions.length);
  return (
   <motion.div  initial={{ opacity: 0,  }}
   animate={{ opacity: 1,}}
   transition={{ duration: 0.6, ease: "easeOut" }}
   >

    <div className='flex justify-between items-center px-5'>
        <div>
            <h1 className='font-semibold text-2xl'>All Participants</h1>
            <p className='text-[#16C098] mt-2'>Active Participants</p>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-[#F9FBFF]">
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
              placeholder="Search submission"
              className="w-full max-w-md outline-none border-none bg-transparent text-sm text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <div className="flex items-center bg-[#F9FBFF] px-3 py-2 rounded-lg gap-1">
            <p className="text-[#7E7E7E] text-sm">Sort by :</p>
            <select
              value={sortOrder}
              onChange={e => {
                setSortOrder(e.target.value)
                setCurrentPage(1)
              }}
              className="font-semibold text-sm cursor-pointer outline-none"
              aria-label="Sort submissions"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>

    </div>

    <section>
    <table className="table-auto w-full mt-5">
  <thead>
    <tr className=" border-b border-gray-200 text-[#B5B7C0]">
      <th className="px-4 py-2 text-left">Project</th>
      <th className="px-4 py-2 text-left">Team</th>
      <th className="px-4 py-2 text-left">Date</th>
      <th className="px-4 py-2 text-left">Status</th>
      <th className="px-4 py-2 text-left">Action</th>
    </tr>
  </thead>
  <tbody>
   {filteredSubmissions.map((sub, index) => (
      <tr key={index} className="hover:bg-gray-50 border-b border-[#EEEEEE]">
        <td className="px-4 py-5">
            <div>
                <h1 className='font-bold  text-[#212121]'>{sub.title}</h1>
                <p className='text-[#727272] font-medium'>{sub.categoty}</p>
            </div>
        </td>
        <td className="px-4 py-5"> <div>
                <h1 className='font-bold  text-[#212121]'>{sub.team}</h1>
                <p className='text-[#727272] font-medium'>{sub.members} members</p>
            </div></td>
        <td className="px-2 py-5 text-[#292D32] font-medium">{sub.date}</td>
        <td className="px-5 py-3">
            <span className={`px-5 py-2 rounded-lg font-semibold border-[#DF0404] border bg-[#FFC5C5] text-[#DF0404] `}>
                {sub.status}
            </span>
        </td>
      </tr>
    ))}
  </tbody>

   </table>

   <div className='flex justify-between items-center mt-5 px-5'>
    <p className='text-[#727272]'>Showing data { end === 0 ? "0" : start } to {end}  of {filteredSubmissions.length} entries</p>
    <nav className="flex justify-center items-center gap-3 mt-5">
        <p onClick={handlePrev}    className='border px-4 rounded-lg cursor-pointer bg-[#F5F5F5] border-[#EEEEEE] py-2 text-[#404B52] font-semibold'  > {" < "} </p>
      <ul className="flex space-x-2">
        {Array.from({ length: totalPages }, (_, index) => (
          <li key={index}>
            <button
              onClick={() => handlePageChange(index + 1)}
              className={`px-4 py-2 rounded-lg ${currentPage === index + 1 ? 'bg-[#5932EA] text-white ' : 'bg-[#F5F5F5] text-[#404B52] border cursor-pointer border-[#EEEEEE] hover:bg-bg-[#5932EA] hover:text-[#404B52]'}`}
            >
              {index + 1}
            </button>
          </li>
        ))}
      </ul>
      <p onClick={handleNext}    className='border px-4 rounded-lg cursor-pointer bg-[#F5F5F5] border-[#EEEEEE] py-2 text-[#404B52] font-semibold'  > {" > "} </p>

    </nav>
   </div>



    </section>


   </motion.div>
  )
}

export default Rejected;