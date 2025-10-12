"use client"

import React, { useState, useEffect } from "react"
import { Filter } from "lucide-react"
import Image from "next/image"
import { useUserHackathonsStore } from "@/store/useUserHackathons"
import useParticipants from "@/hooks/useParticipants"
import HtmlContent from "@/components/ui/HtMLContent"

const FilterOption = [
  "All Hackathons",
  "Ongoing Hackathons",
  "Ended Hackathons",
]

function Hackathons() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(FilterOption[0])

  const { getHackathons } = useParticipants()
  const { hackathons, setHackathons } = useUserHackathonsStore()
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

  return (
    <section className="h-[85vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-shrink-0">
        <h1 className="font-semibold text-lg">{selected}</h1>

        {/* Filter dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 px-3 py-2 border rounded-lg bg-[#F2F1FD] shadow-sm border-[#605DEC] cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">{selected}</span>
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
              {FilterOption.map((option, index) => (
                <div
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={`px-4 py-2 cursor-pointer text-sm hover:bg-gray-100 ${
                    index !== FilterOption.length - 1 ? "border-b" : ""
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
          <p className="text-gray-500">Loading hackathons...</p>
        ) : isError ? (
          <p className="text-red-500">Failed to load hackathons.</p>
        ) : hackathons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hackathons.map((hackathon) => (
              <div
                key={hackathon.id}
                className="border rounded-xl shadow-sm bg-white overflow-hidden"
              >
                {/* Banner Image */}
                {hackathon?.banner_image ? (
                  <Image
                    src={
                      hackathon.banner_image?.startsWith("http")
                        ? hackathon.banner_image
                        : `https://res.cloudinary.com/dvuwy2tny/image/upload/${hackathon?.banner_image}`
                    }
                    alt={hackathon.title || "Hackathon Banner"}
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}

                <div className="p-4">
                  <h2 className="font-semibold text-lg">{hackathon?.title}</h2>
                  <div className="text-sm text-gray-600 line-clamp-2">
                    <HtmlContent html={hackathon?.description || ""} />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    📍 {hackathon.venue} • 👥 {hackathon?.participants_count} participants
                  </p>
                  <p className="text-xs text-gray-500">
                    🏆 Prize: ${hackathon.grand_prize?.toLocaleString() ?? 0}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hackathons available.</p>
        )}
      </div>
    </section>
  )
}

export default Hackathons


