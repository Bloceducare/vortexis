"use client";
import { useEffect, useState } from "react";
import { HelpCircle, Plus, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HackathonCard } from "@/components/dashboard/HackathonCard";
import { DeadlineItem } from "@/components/dashboard/DeadlineItem";
import { QuickActionButton } from "@/components/dashboard/QuickActionButton";
import useParticipants from "@/hooks/useParticipants";
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";
import { useUserHackathonsStore } from "@/store/useUserHackathons";

const Page = () => {
  const user = useUserStore((state) => state.user);
  const { getHackathons } = useParticipants();
  const router = useRouter();
  const { hackathons, setHackathons } = useUserHackathonsStore();
  const { data, isLoading, refetch } = getHackathons();

  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<"Active" | "Upcoming" | "Ended">(
    "Active"
  );
  const [filterType, setFilterType] = useState<
    "all" | "date" | "month" | "year"
  >("all");
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    if (data) {
      setHackathons(data);
    }
  }, [data, setHackathons]);

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
      subtitle: hackathon.title,
      daysLeft: calculateDaysLeft(hackathon.submission_deadline),
      date: new Date(hackathon.submission_deadline).toLocaleDateString(),
      rawDate: hackathon.submission_deadline,
      type: "green" as const,
    }))
    .filter((d: any) => new Date(d.rawDate) >= new Date())
    .sort(
      (a: any, b: any) =>
        new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
    );

  const visibleDeadlines = expanded ? deadlines : deadlines?.slice(0, 3);

  // Format hackathons
  const formattedHackathons = hackathons
    ?.map((hackathon: any) => {
      const today = new Date();
      const start = new Date(hackathon.start_date);
      const end = new Date(hackathon.end_date);

      let status: "Upcoming" | "Active" | "Ended";

      if (today < start) {
        status = "Upcoming";
      } else if (today >= start && today <= end) {
        status = "Active";
      } else {
        status = "Ended";
      }

      return {
        id: hackathon.id,
        title: hackathon.title,
        daysLeft: calculateDaysLeft(hackathon.end_date),
        date: new Date(hackathon.submission_deadline).toLocaleDateString(),
        status,
        rawDate: hackathon.end_date,
        venue: hackathon.venue,
      };
    })
    .sort(
      (a: any, b: any) =>
        new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
    );

  // Apply tab filter
  let displayedHackathons = formattedHackathons?.filter(
    (h: any) => h.status === activeTab
  );

  // Apply date/month/year filter
  if (filterType !== "all" && filterValue) {
    displayedHackathons = displayedHackathons?.filter((h: any) => {
      const dateObj = new Date(h.rawDate);

      if (filterType === "date") {
        return (
          dateObj.toLocaleDateString() ===
          new Date(filterValue).toLocaleDateString()
        );
      }
      if (filterType === "month") {
        return (
          dateObj.getMonth() === new Date(filterValue).getMonth() &&
          dateObj.getFullYear() === new Date(filterValue).getFullYear()
        );
      }
      if (filterType === "year") {
        return dateObj.getFullYear() === new Date(filterValue).getFullYear();
      }
      return true;
    });
  }

  const quickActions = [
    { icon: HelpCircle, label: "Ask a Question" },
    {
      icon: Plus,
      label: "Join New Hackathon",
      action: () => router.push("/hackathon"),
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-800 rounded-xl p-4 space-y-8 animate-pulse transition-colors">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
        <div className="space-y-4 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-800 rounded-xl p-4 transition-colors">
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">
            Welcome, {user?.first_name}!{" "}
            <span className="text-lg font-normal text-gray-600 dark:text-gray-300 ml-2">
              Ready to build something great?
            </span>
          </h1>
          <button
            onClick={() => refetch()}
            className="text-sm px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {/* Tabs + Filter */}
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex gap-3">
            {["Active", "Upcoming", "Ended"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex gap-2 items-center">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
            >
              <option value="all">All</option>
              <option value="date">By Date</option>
              <option value="month">By Month</option>
              <option value="year">By Year</option>
            </select>

            {filterType !== "all" && (
              <input
                type={filterType === "year" ? "number" : "date"}
                placeholder={filterType === "year" ? "Enter year" : ""}
                onChange={(e) => setFilterValue(e.target.value)}
                className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-colors"
              />
            )}
          </div>
        </div>

        {/* Hackathons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
            {activeTab} Hackathons
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedHackathons?.length > 0 ? (
              displayedHackathons.map((hackathon: any, index: number) => (
                <HackathonCard key={index} {...hackathon} />
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400">
                No {activeTab.toLowerCase()} hackathons found.
              </p>
            )}
          </div>
        </div>

        {/* Deadlines + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Deadlines */}
          <Card>
            <header className="pb-4 p-5 flex justify-between items-center">
              <h2 className="flex items-center gap-2 text-red-600 text-xl">
                <AlertCircle className="w-5 h-5" />
                Upcoming Deadlines
              </h2>
            </header>
            <div className="space-y-2">
              {visibleDeadlines?.map((deadline: any, index: number) => (
                <DeadlineItem key={index} {...deadline} />
              ))}
            </div>

            {deadlines?.length > 3 && (
              <div className="p-4">
                <button
                  className="text-blue-600 text-sm font-medium hover:underline cursor-pointer"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "Show less" : `Show ${deadlines.length - 3} more`}
                </button>
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <header className="pb-4 p-5">
              <h2 className="text-green-600 text-xl">Quick Actions</h2>
            </header>
            <div className="space-y-3">
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
