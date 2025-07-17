"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FinalDecision from "@/components/collaborations/finalDecision";
import JudgeOnlyRoom from "@/components/collaborations/judgeOnlyRoom";
import OrganizerDiscussion from "@/components/collaborations/organizerDiscussion";

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

function CollaborationPageContent() {
  const [activeTab, setActiveTab] = useState(1);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTabChange = (tabNo: number) => {
    setActiveTab(tabNo);
    router.replace(`?tab=${tabNo}`, { scroll: false });
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) setActiveTab(Number(tabParam));
  }, [searchParams]);

  return (
    <div>
      <div className="my-3 mb-8">
        <h1 className="text-2xl mb-3 font-semibold text-[#605DEC]">
          Judge Collaboration
        </h1>
        <p>Collaborate with other judges and discuss submissions</p>
      </div>

      <div className="bg-[#FFFFFF] my-3 shadow-md rounded-md border p-3 w-[1114px] border-[#E4E4E4]">
        <div>
          <div className="flex my-6 mt-1.5 w-[645px] cursor-pointer gap-4">
            {tabs.map((tab, i) => (
              <div
                key={i}
                className="w-[203px]"
                onClick={() => handleTabChange(tab.tab_no)}
              >
                <p
                  className={`text-center px-5 py-2 ${
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

export default function CollaborationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CollaborationPageContent />
    </Suspense>
  );
}
