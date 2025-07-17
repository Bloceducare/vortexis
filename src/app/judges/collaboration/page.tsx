"use client";
import FinalDecision from "@/components/collaborations/finalDecision";
import JudgeOnlyRoom from "@/components/collaborations/judgeOnlyRoom";
import OrganizerDiscussion from "@/components/collaborations/organizerDiscussion";
import { useState } from "react";

const tabs = [
  {
    name: "Judge-Only Room",
    tab_no: 1,
  },
  {
    name: "Organizer Discussion",
    tab_no: 2,
  },
  {
    name: "Final Decision",
    tab_no: 3,
  },
];

// interface PageProps {
//   params: { id: string };
//   searchParams?: Record<string, string | string[] | undefined>; // Add this
// }

export default function CollaborationPage() {
  const [activeTab, setActiveTab] = useState(1);

  // Use params.id to avoid unused params warning
  // console.log(params.id);

  return (
    <div>
      <div className="my-3 mb-8">
        <h1 className="text-2xl mb-3 font-semibold text-[#605DEC]">
          Judge Collaboration
        </h1>
        <p>Collaborate with other judges and discuss submissions</p>
      </div>

      <div className="bg-[#FFFFFF] my-3 shadow-md rounded-md border p-3 border-[#E4E4E4]">
        <div>
          <div className="flex my-6 mt-1.5 cursor-pointer gap-4">
            {tabs.map((tab, i) => (
              <div key={i} onClick={() => setActiveTab(tab.tab_no)}>
                <p
                  className={`text-center px-7 py-2 ${
                    activeTab === tab.tab_no
                      ? "bg-[#605DEC] text-white"
                      : "bg-[#F4F3FE] text-[#C5C0DB]"
                  } transition-all duration-300 rounded-md`}
                >
                  {tab.name}
                </p>
              </div>
            ))}
          </div>
        </div>

        {activeTab === 1 && <JudgeOnlyRoom />}
        {activeTab === 2 && <OrganizerDiscussion />}
        {activeTab === 3 && <FinalDecision />}
      </div>
    </div>
  );
}
