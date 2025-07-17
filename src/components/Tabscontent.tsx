"use client";
import Deliverables from "@/components/judgeReview/deliverables";
import Evaluation from "@/components/judgeReview/evaluation";
import Members from "@/components/judgeReview/members";
import Vote from "@/components/judgeReview/vote";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const tabs = [
  {
    name: "Project Details",
    tab_no: 1,
  },
  {
    name: "Deliverables",
    tab_no: 2,
  },
  {
    name: "Team Info",
    tab_no: 3,
  },
  {
    name: "Evaluation",
    tab_no: 4,
  },
];

function Tabscontent() {
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
      <div className="flex mb-6 -mt-1.5 w-[860px] cursor-pointer gap-4 ">
        {tabs.map((tab, i) => {
          return (
            <div
              key={i}
              className="w-[203px]"
              onClick={() => handleTabChange(tab.tab_no)}
            >
              <p
                className={`text-center px-7 py-2 ${
                  activeTab === i + 1
                    ? "bg-[#605DEC] text-white"
                    : "bg-[#F4F3FE] text-[#C5C0DB]"
                } transition-all duration-300 rounded-md `}
              >
                {tab.name}
              </p>
            </div>
          );
        })}
      </div>

      {activeTab === 1 && <Vote />}
      {activeTab === 2 && <Deliverables />}
      {activeTab === 3 && <Members />}
      {activeTab === 4 && <Evaluation />}
    </div>
  );
}

export default Tabscontent;
