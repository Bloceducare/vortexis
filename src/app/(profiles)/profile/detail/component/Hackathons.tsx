"use client"

import React, { useState, useEffect } from "react"
import { Filter, Trophy } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useUserHackathonsStore } from "@/store/useUserHackathons"
import useParticipants from "@/hooks/useParticipants"
import HtmlContent from "@/components/ui/HtMLContent"
import { useHackathonStore } from "@/store/useHackathonStore"
import { slugify } from "@/lib/utils"


const FilterOption = [
  "All Hackathons",
  "Ongoing Hackathons",
  "Ended Hackathons",
]

function Hackathons() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(FilterOption[0])

  const { getHackathons } = useParticipants()
  const { hackathons, setHackathons } = useUserHackathonsStore()
      const { setActiveHackathon } = useHackathonStore();

         const handleCardClick  = (hackathon: any) => {
        setActiveHackathon(hackathon);
       const slug = slugify(hackathon.title);
        router.push(`/hackathon/${slug}`);
      };
  
  const { data, isLoading, isError } = getHackathons()

  // sync fetched data into store
  useEffect(() => {
    if (data) {
      setHackathons(data)
    }
  }, [data, setHackathons])

  const handleSelect = (option: string) => {
    setSelected(option)
    setOpen(false)
  }



  // Filter hackathons based on selected option
  const getFilteredHackathons = () => {
    if (!hackathons) return []
    
    const now = new Date()
    
    switch (selected) {
      case "Ongoing Hackathons":
        return hackathons.filter((h) => {
          const start = h.start_date ? new Date(h.start_date) : new Date(0)
          const end = h.end_date ? new Date(h.end_date) : new Date(0)
          return start <= now && end >= now
        })

      
      case "Ended Hackathons":
        return hackathons.filter((h) => {
          const end = h.end_date ? new Date(h.end_date) : new Date(0)
          return end < now
        })
      
      case "All Hackathons":
      default:
        return hackathons
    }
  }

  const filteredHackathons = getFilteredHackathons()

  return (
    <section className="h-[85vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 shrink-0">
        <h1 className="font-semibold text-lg dark:text-white">{selected}</h1>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-[#F2F1FD] dark:bg-gray-800 shadow-sm border-[#605DEC] dark:border-indigo-600 cursor-pointer transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm dark:text-gray-300">{selected}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 transition-colors">
              {FilterOption.map((option, index) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 ${
                    index !== FilterOption.length - 1 ? "border-b border-gray-200 dark:border-gray-700" : ""
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
        {isLoading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading hackathons...</p>
        ) : isError ? (
          <p className="text-red-500 dark:text-red-400">Failed to load hackathons.</p>
        ) : filteredHackathons.length > 0 ? (
          <div className="flex flex-col gap-4 w-full">
            {filteredHackathons?.map((hackathon) => (
              <div
                key={hackathon.id}
                onClick={() => handleCardClick(hackathon)}
                className="w-full flex flex-col md:flex-row gap-4 p-4 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm bg-white dark:bg-gray-800 transition-all cursor-pointer hover:shadow-md hover:bg-gray-50 dark:hover:bg-gray-700/50 overflow-hidden"
              >
                {/* Banner Image */}
                <div className="shrink-0 w-full md:w-40 h-40 md:h-28 rounded-lg overflow-hidden relative">
                  {hackathon?.banner_image ? (
                    <Image
                      src={
                        hackathon.banner_image?.startsWith("http")
                          ? hackathon.banner_image
                          : `https://res.cloudinary.com/dvuwy2tny/image/upload/${hackathon?.banner_image}`
                      }
                      alt={hackathon.title || "Hackathon Banner"}
                      width={160}
                      height={112}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/20 dark:to-purple-900/20">
                      <Trophy className="w-10 h-10 text-indigo-400/40" />
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <h2 className="font-semibold text-lg dark:text-white mb-2 leading-tight break-all">{hackathon?.title}</h2>
                  
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 md:w-2/3 break-words">
                      <HtmlContent html={hackathon?.description?.slice(0, 250) || ""} />
                    </div>
                    
                    <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400 md:text-right gap-1 whitespace-nowrap shrink-0">
                      <p className="truncate max-w-[200px] md:max-w-none">📍 {hackathon.venue}</p>
                      <p>👥 {hackathon?.participants_count} participants</p>
                      <p>🏆 Prize: ${hackathon.grand_prize?.toLocaleString() ?? 0}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">
            No {selected.toLowerCase()} available.
          </p>
        )}
      </div>
    </section>
  )
}

export default Hackathons


