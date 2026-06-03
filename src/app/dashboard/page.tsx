"use client";
import { useEffect, useState } from "react";
import { HelpCircle, Plus, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HackathonCard } from "@/components/dashboard/HackathonCard";
import { DeadlineItem } from "@/components/dashboard/DeadlineItem";
import { QuickActionButton } from "@/components/dashboard/QuickActionButton";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useUserHackathonsStore } from "@/store/useUserHackathons";


const Page = () => {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { hackathons } = useUserHackathonsStore();
  

  // --- States ---
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"Active" | "Upcoming" | "Ended">("Active");
  const [filterType, setFilterType] = useState<"all" | "date" | "month" | "year">("all");
  const [filterValue, setFilterValue] = useState("");
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // --- Logic ---

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, filterType, filterValue]);

  const calculateDaysLeft = (date: string) => {
    const today = new Date();
    const target = new Date(date);
    const diff = target.getTime() - today.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  // Filter deadlines: only future ones
  const deadlines = hackathons
    ?.map((hackathon: any) => ({
      title: "Submission Deadline",
      
    }))
    .filter((d: any) => new Date(d.rawDate) >= new Date())
    .sort((a: any, b: any) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());

  const visibleDeadlines = expanded ? deadlines : deadlines?.slice(0, 3);

  // Format & Filter Hackathons
  const formattedHackathons = hackathons
    ?.map((hackathon: any) => {
      const today = new Date();
      const start = new Date(hackathon.start_date);
      const end = new Date(hackathon.end_date);
      let status: "Upcoming" | "Active" | "Ended";

      if (today < start) status = "Upcoming";
      else if (today >= start && today <= end) status = "Active";
      else status = "Ended";

      return {
        id: hackathon.id,
        title: hackathon.title,
        daysLeft: calculateDaysLeft(hackathon.end_date),
        date: new Date(hackathon.submission_deadline).toLocaleDateString(),
        status,
        rawDate: hackathon.end_date,
        venue: hackathon.venue,
        submission_deadline: hackathon.submission_deadline
      };
    });

  // Apply Category and Search Filters
  let filteredList = formattedHackathons?.filter((h: any) => h.status === activeTab) || [];

  if (filterType !== "all" && filterValue) {
    filteredList = filteredList.filter((h: any) => {
      const dateObj = new Date(h.rawDate);
      if (filterType === "date") return dateObj.toLocaleDateString() === new Date(filterValue).toLocaleDateString();
      if (filterType === "month") return dateObj.getMonth() === new Date(filterValue).getMonth() && dateObj.getFullYear() === new Date(filterValue).getFullYear();
      if (filterType === "year") return dateObj.getFullYear() === Number(filterValue);
      return true;
    });
  }

  // Sort by date (closest first)
  filteredList.sort((a: any, b: any) => new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime());

  // --- Pagination Calculation ---
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentHackathons = filteredList.slice(startIndex, startIndex + itemsPerPage);

  const quickActions = [
    { icon: HelpCircle, label: "Ask a Question" },
    {
      icon: Plus,
      label: "Join New Hackathon",
      action: () => router.push("/hackathon"),
    },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 rounded-xl p-4 space-y-8 animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 rounded-xl p-3 md:p-4 transition-colors">
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
            Welcome, {user?.first_name}!
          </h1>
          <p className="text-xs md:text-lg font-normal text-gray-600 dark:text-gray-300 md:ml-1">
            Ready to build something great?
          </p>
        </div>

        {/* Tabs + Filter Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex gap-2 md:gap-3 bg-gray-100 dark:bg-gray-900/50 p-1 rounded-xl">
            {["Active", "Upcoming", "Ended"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-medium text-sm md:text-base cursor-pointer transition-all ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center w-full md:w-auto">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-2 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              <option value="all">All Time</option>
              <option value="date">Specific Date</option>
              <option value="month">Month</option>
              <option value="year">Year</option>
            </select>

            {filterType !== "all" && (
              <input
                type={filterType === "year" ? "number" : filterType === "month" ? "month" : "date"}
                onChange={(e) => setFilterValue(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-sm"
              />
            )}
          </div>
        </div>

        {/* Hackathons Grid */}
        <div className="space-y-4">
          <h2 className="text-xl md:text-2xl font-bold text-green-600 dark:text-green-400">
            {activeTab} Hackathons ({filteredList.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {currentHackathons.length > 0 ? (
              currentHackathons.map((hackathon: any) => (
                <HackathonCard key={hackathon.id} hackathon={hackathon} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl">
                <p className="text-gray-500 dark:text-gray-400">No {activeTab.toLowerCase()} hackathons match your filters.</p>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="p-2 rounded-lg border dark:border-gray-700 disabled:opacity-30 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-blue-600 text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="p-2 rounded-lg border dark:border-gray-700 disabled:opacity-30 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Bottom Section: Deadlines & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <Card className="p-0 overflow-hidden">
            <header className="p-5 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/20">
              <h2 className="flex items-center gap-2 text-red-600 font-bold md:text-xl">
                <AlertCircle className="w-5 h-5" />
                Upcoming Deadlines
              </h2>
            </header>
            <div className="p-2 space-y-1">
              {visibleDeadlines?.length ? (
                visibleDeadlines.map((deadline: any, index: number) => (
                  <DeadlineItem key={index} {...deadline} />
                ))
              ) : (
                <p className="p-4 text-sm text-gray-500">No upcoming deadlines.</p>
              )}
            </div>
            {deadlines?.length > 3 && (
              <button
                className="w-full py-3 text-blue-600 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t dark:border-gray-700"
                onClick={() => setExpanded(!expanded)}
              >
                {expanded ? "Show Less" : `View All (${deadlines.length})`}
              </button>
            )}
          </Card>

          <Card className="p-0 overflow-hidden">
            <header className="p-5 border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/20">
              <h2 className="text-green-600 font-bold md:text-xl">Quick Actions</h2>
            </header>
            <div className="p-5 space-y-3">
              {quickActions.map((action, index) => (
                <QuickActionButton
                  key={index}
                  icon={action.icon}
                  label={action.label}
                  onClick={action.action}
                />
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;