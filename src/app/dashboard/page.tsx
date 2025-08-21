'use client';
import { Users, FileText, HelpCircle, Plus, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HackathonCard } from "@/components/dashboard/HackathonCard";
import { DeadlineItem } from "@/components/dashboard/DeadlineItem";
import { QuickActionButton } from "@/components/dashboard/QuickActionButton";
import useParticipants from '@/hooks/useParticipants';
import { useUserStore } from "@/store/useUserStore";
import { useRouter } from "next/navigation";

const Page = () => {
  const user = useUserStore((state) => state.user);
  const { getHackathons } = useParticipants();
  const router = useRouter();

  const { data, isLoading, isError, refetch } = getHackathons();

  const calculateDaysLeft = (date: string) => {
    const today = new Date();
    const target = new Date(date);
    const diff = target.getTime() - today.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  };

  const deadlines = data?.map((hackathon: any) => ({
    title: "Submission Deadline",
    subtitle: hackathon.title,
    daysLeft: calculateDaysLeft(hackathon.submission_deadline),
    date: new Date(hackathon.submission_deadline).toLocaleDateString(),
    rawDate: hackathon.submission_deadline,
    type: "green" as const,
  })).sort(
    (a: any, b: any) =>
      new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
  );

  const hackathons = data?.map((hackathon: any) => {
    const today = new Date();
    const start = new Date(hackathon.start_date);
    const end = new Date(hackathon.end_date);

    let status = "Upcoming";
    if (today >= start && today <= end) {
      status = "Active";
    } else if (today > end) {
      status = "Ended";
    }

    return {
      title: hackathon.title,
      daysLeft: calculateDaysLeft(hackathon.end_date),
      date: new Date(hackathon.submission_deadline).toLocaleDateString(),
      status,
      rawDate: hackathon.end_date,
    };
  }).sort(
    (a: any, b: any) =>
      new Date(a.rawDate).getTime() - new Date(b.rawDate).getTime()
  );

  const quickActions = [
    { icon: Users, label: "Create or Join Team" },
    { icon: FileText, label: "Submit Project" },
    { icon: HelpCircle, label: "Ask a Question" },
    { icon: Plus, label: "Join New Hackathon", action: () => router.push("/home") }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white rounded-xl p-4 space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>

        <div className="space-y-4 flex gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 rounded-lg w-full"
            ></div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-64 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded-xl p-4">
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2 flex items-center justify-between">
          <h1 className="text-4xl font-bold text-blue-600">
            Welcome, {user?.first_name}!{" "}
            <span className="text-lg font-normal text-gray-600 ml-2">
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

        {/* Hackathons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600">Your Hackathons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons?.map((hackathon: any, index: number) => (
              <HackathonCard key={index} {...hackathon} />
            ))}
          </div>
        </div>

        {/* Deadlines + Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deadlines */}
          <div className="lg:col-span-1">
            <Card>
              <header className="pb-4 p-5 flex justify-between items-center">
                <h2 className="flex items-center gap-2 text-red-600 text-xl">
                  <AlertCircle className="w-5 h-5" />
                  Upcoming Deadlines
                </h2>
              </header>
              <div className="space-y-2">
                {deadlines?.map((deadline: any, index: number) => (
                  <DeadlineItem key={index} {...deadline} />
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <header className="pb-4 p-5">
                <h2 className="text-green-600 text-xl">Quick Actions</h2>
              </header>
              <p className="space-y-3">
                {quickActions.map((action, index) => (
                  <QuickActionButton
                    key={index}
                    icon={action.icon}
                    label={action.label}
                    onClick={action.action}
                  />
                ))}
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
