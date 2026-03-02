"use client";
import Deliverables from "@/components/judgeReview/deliverables";
import Evaluation from "@/components/judgeReview/evaluation";
import Members from "@/components/judgeReview/members";
import Vote from "@/components/judgeReview/vote";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import OtherJudges from "./judgeReview/overview";
import { Submission } from "@/hooks/useHackathonDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const tabs = [
  { name: "Project Details", tab_no: 1 },
  { name: "Deliverables", tab_no: 2 },
  { name: "Team Info", tab_no: 3 },
  { name: "Evaluation", tab_no: 4 },
  { name: "reviews", tab_no: 5 },
];

interface TabscontentProps {
  submission: Submission;
  hackathonId: string;
}

function Tabscontent({
  submission: currentSubmission,
  hackathonId,
}: TabscontentProps) {
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
      {/* Desktop Tabs - Hidden on mobile */}
      <div className="hidden md:flex mb-6 -mt-1.5 xl:w-[950px] lg:w-[830px] md:w-[730px] w-full cursor-pointer gap-4">
        {tabs.map((tab, i) => (
          <div
            key={i}
            className="w-[203px]"
            onClick={() => handleTabChange(tab.tab_no)}
          >
            <p
              className={`text-center px-7 py-2 ${activeTab === i + 1
                  ? "bg-[#605DEC] text-white"
                  : "bg-[#F4F3FE] dark:bg-gray-700 text-[#C5C0DB] dark:text-gray-300"
                } transition-all duration-300 rounded-md `}
            >
              {tab.name}
            </p>
          </div>
        ))}
      </div>

      {/* Mobile Tabs - Horizontal Scrolling */}
      <div className="md:hidden mb-6 -mt-1.5 overflow-x-auto scrollbar-hide py-1">
        <div className="flex gap-3 min-w-max px-1">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => handleTabChange(tab.tab_no)}
              className={`px-5 py-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors ${activeTab === tab.tab_no
                  ? "bg-[#605DEC] text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 1 && <Vote items={currentSubmission} />}
        {activeTab === 2 && <Deliverables items={currentSubmission} />}
        {activeTab === 3 && <Members items={currentSubmission} />}
        {activeTab === 4 && (
          <Evaluation
            hackathonId={hackathonId}
            submissionId={currentSubmission.id}
            onSubmissionComplete={() => {
              // Review submitted successfully
            }}
          />
        )}
        {activeTab === 5 && <OtherJudges reviews={currentSubmission.reviews} />}
      </div>

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default Tabscontent;
