import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SubmissionProps } from '@/app/api/utils/interface'
import { ParticipantsSkeleton } from '../../participants/page'

const All: React.FC<SubmissionProps> = ({
  submissions,
  isLoading,
  isFetching,
  isError,
  refetch,
}) => {
  const SubmissionsPerPage = 8
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([])

  const totalPages = Math.ceil(
    (submissions?.filter(sub =>
      sub.project.toLowerCase().includes(searchTerm.toLowerCase())
    ).length ?? 0) / SubmissionsPerPage
  )
  

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const start = (currentPage - 1) * SubmissionsPerPage + 1
  const end = Math.min(currentPage * SubmissionsPerPage, filteredSubmissions.length)

  const handleNext = () => {
    if (currentPage < totalPages) handlePageChange(currentPage + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) handlePageChange(currentPage - 1)
  }

  useEffect(() => {
    if (!submissions) return;
  
    const filtered = submissions.filter(sub =>
      sub.project?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  
    const sorted = filtered.sort((a, b) => {
      const dateA = new Date(a.created_at).getTime()
      const dateB = new Date(b.created_at).getTime()
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB
    })
  
    const startIndex = (currentPage - 1) * SubmissionsPerPage
    const endIndex = startIndex + SubmissionsPerPage
  
    setFilteredSubmissions(sorted.slice(startIndex, endIndex))
  }, [submissions, searchTerm, sortOrder, currentPage])
  

  if (isLoading) return <ParticipantsSkeleton />;

  if (isError)
    return (
      <div className="text-center p-10 text-red-500">
        Failed to load submissions.
        <br />
        <button onClick={refetch} className="mt-2 underline text-blue-500 cursor-pointer">
          Retry
        </button>
      </div>
    )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="flex justify-between items-center px-3 xl:px-5">
        <div>
          <h1 className="font-semibold text-2xl">All Participants</h1>
          <p className="text-[#16C098] mt-2">Active Participants</p>
        </div>

        <div className="flex items-center justify-between gap-5">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-[#F9FBFF]">
            <svg
              width="24"
              height="24"
              fill="none"
              stroke="#7E7E7E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
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
                setSortOrder(e.target.value as 'newest' | 'oldest')
                setCurrentPage(1)
              }}
              className="font-semibold text-sm cursor-pointer outline-none"
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
            <tr className="border-b border-gray-200 text-[#B5B7C0]">
              <th className="px-4 py-2 text-left">Project</th>
              <th className="px-4 py-2 text-left">Team</th>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>

{filteredSubmissions.length === 0 ? (
<tr>
<td colSpan={6} className="text-center py-10 text-gray-500">
No Submission found.
</td>
</tr>
) : (
  filteredSubmissions.map((sub, index) => (
    <tr key={index} className="hover:bg-gray-50 border-b border-[#EEEEEE]">
      <td className="px-4 py-5">
        <h1 className="font-bold text-[#212121]">{sub.project}</h1>
      </td>
      <td className="px-4 py-5">
        <h1 className="font-semibold text-[#212121]">{sub.team}</h1>
      </td>
      <td className="px-2 py-5 text-[#292D32] font-medium">
        {new Date(sub.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-5">
        <span className="px-4 py-2 rounded-lg font-semibold bg-[#F9FBFF] text-[#555] border border-[#DDD]">
          {sub.status}
        </span>
      </td>
      <td className="px-4 py-5">
        <span
          className={`px-4 py-2 rounded-lg font-semibold border ${
            sub.approved
              ? 'bg-[#16C09861] text-[#16C098] border-[#16C098]'
              : 'bg-[#F9831C61] text-[#F9831C] border-[#F9831C]'
          }`}
        >
          {sub.approved ? 'Approved' : 'Not Approved'}
        </span>
      </td>
      <td className="px-4 py-5 text-sm text-blue-600 underline cursor-pointer">
        View
      </td>
      </tr>
))
)}
</tbody>
        </table>

        <div className="flex justify-between items-center mt-5 px-5">
          <p className="text-[#727272]">
            Showing {end === 0 ? '0' : start} to {end} of {submissions.length} entries
          </p>

          <nav className="flex items-center gap-3 mt-5">
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
  )
}

export default All
