"use client"

import React, { useState } from 'react'
import Invitation from './component/Invitation'
import JudgesList from './component/JudgesList'
import { useParams } from 'next/navigation'
import useOrganizer from '@/hooks/useOrganizer'


const tab = [  "Judges List", "Invite Judges",]

function Judges() {
  const [activeTab, setActiveTab] = useState("Invite Judges")

  const { getHackathonJudges, inviteJudgesMutation  } = useOrganizer()



 const params = useParams();
  const hackathon_id = params?.hackathon_id as string;

  console.log(hackathon_id)


  const { data, isLoading, isFetching, isError, refetch } = getHackathonJudges(hackathon_id)

  return (
    <section className="bg-white px-10 rounded-2xl py-5">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        {tab.map((item) => (
          <button
            key={item}
            onClick={() => setActiveTab(item)}
            className={`px-8 py-4 rounded-lg transition cursor-pointer ${
              activeTab === item
                ? "bg-[#605DEC] text-white"
                : "bg-[#F4F3FE] text-[#C5C0DB]"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeTab === "Invite Judges" && <Invitation hackathon_id={hackathon_id} />}
        {activeTab === "Judges List" && <JudgesList  judges={data}
            isLoading={isLoading}
            isFetching={isFetching}
            isError={isError}
            refetch={refetch} />}
      </div>
    </section>
  )
}

export default Judges
