"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import FinalDecision from "@/components/collaborations/finalDecision";
import JudgeOnlyRoom from "@/components/collaborations/judgeOnlyRoom";
import OrganizerDiscussion from "@/components/collaborations/organizerDiscussion";
import { ChevronDown } from "lucide-react";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleTabChange = (tabNo: number) => {
    setActiveTab(tabNo);
    setIsDropdownOpen(false);
    router.replace(`?tab=${tabNo}`, { scroll: false });
  };

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) setActiveTab(Number(tabParam));
  }, [searchParams]);

  const activeTabName = tabs.find((tab) => tab.tab_no === activeTab)?.name;

  return (
    <div>
      <div className="my-3 mb-8">
        <h1 className="text-2xl mb-3 font-semibold text-[#605DEC]">
          Judge Collaboration
        </h1>
        <p>Collaborate with other judges and discuss submissions</p>
      </div>

      <div className="bg-[#FFFFFF] my-3 shadow-md rounded-md border p-3 w-full max-w-[1114px] border-[#E4E4E4]">
        <div>
          {/* Desktop Tabs - Hidden on mobile */}
          <div className="hidden md:flex my-6 mt-1.5 md:w-[645px] w-full cursor-pointer gap-4">
            {tabs.map((tab, i) => {
              return (
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
              );
            })}
          </div>

          {/* Mobile Dropdown - Hidden on desktop */}
          <div className="md:hidden my-6 mt-1.5 relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-[#605DEC] text-white rounded-md"
            >
              <span>{activeTabName}</span>
              <ChevronDown
                className={`w-5 h-5 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg mt-1">
                {tabs.map((tab, i) => (
                  <button
                    key={i}
                    onClick={() => handleTabChange(tab.tab_no)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 ${
                      activeTab === tab.tab_no
                        ? "bg-[#F4F3FE] text-[#605DEC] font-medium"
                        : "text-gray-700"
                    } ${i === 0 ? "rounded-t-md" : ""} ${
                      i === tabs.length - 1
                        ? "rounded-b-md"
                        : "border-b border-gray-100"
                    }`}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 1 && <JudgeOnlyRoom />}
          {activeTab === 2 && <OrganizerDiscussion />}
          {activeTab === 3 && <FinalDecision />}
        </div>
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
