"use client"

import React, { useState } from 'react'
import Invitation from './component/Invitation'
import JudgesList from './component/JudgesList'
import { useParams } from 'next/navigation'


const tab = ["Invite Judges", "Judges List"]

function Judges() {
  const [activeTab, setActiveTab] = useState("Invite Judges")

 const params = useParams();
  const hackathon_id = params?.hackathon_id as string;
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
        {activeTab === "Invite Judges" && <Invitation />}
        {activeTab === "Judges List" && <JudgesList />}
      </div>
    </section>
  )
}

export default Judges
