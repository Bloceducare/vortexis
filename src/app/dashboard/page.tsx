'use client';
import { Users, FileText, HelpCircle, Plus, AlertCircle } from "lucide-react";
import {Card} from "@/components/ui/card";
import { HackathonCard } from "@/components/dashboard/HackathonCard";
import { DeadlineItem } from "@/components/dashboard/DeadlineItem";
import { QuickActionButton } from "@/components/dashboard/QuickActionButton";

const Page = () => {
  const hackathons = [
    {
      title: "AI Innovators Hackathon",
      status: "ACTIVE" as const,
      progress: 65,
      daysLeft: 8
    },
    {
      title: "AI Innovators Hackathon",
      status: "ACTIVE" as const,
      progress: 65,
      daysLeft: 8
    },
    {
      title: "AI Innovators Hackathon", 
      status: "ACTIVE" as const,
      progress: 65,
      daysLeft: 8
    }
  ];

  const deadlines = [
    {
      title: "Team Registration Closes",
      subtitle: "Web3 Builder Challenge",
      daysLeft: 5,
      date: "May 15, 2025",
      type: "green" as const
    },
    {
      title: "Team Registration Closes",
      subtitle: "Web3 Builder Challenge", 
      daysLeft: 5,
      date: "May 15, 2025",
      type: "blue" as const
    },
    {
      title: "Team Registration Closes",
      subtitle: "Web3 Builder Challenge",
      daysLeft: 5,
      date: "May 15, 2025",
      type: "green" as const
    },
    {
      title: "Team Registration Closes",
      subtitle: "Web3 Builder Challenge",
      daysLeft: 5,
      date: "May 15, 2025",
      type: "blue" as const
    },
    {
      title: "Team Registration Closes",
      subtitle: "Web3 Builder Challenge",
      daysLeft: 5,
      date: "May 15, 2025",
      type: "blue" as const
    },
    {
      title: "Team Registration Closes",
      subtitle: "Web3 Builder Challenge",
      daysLeft: 5,
      date: "May 15, 2025",
      type: "green" as const
    }
  ];

  const quickActions = [
    { icon: Users, label: "Create or Join Team" },
    { icon: FileText, label: "Submit Project" },
    { icon: HelpCircle, label: "Ask a Question" },
    { icon: Plus, label: "Join New Hackathon" }
  ];

  return (
    <div className="min-h-screen bg-white rounded-xl p-4">
      <div className="w-full mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-blue-600">
            Welcome, Sharon! <span className="text-lg font-normal text-gray-600 ml-2">Ready to build something great?</span>
          </h1>
        </div>

        {/* Active Hackathons */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-green-600">Your Active Hackathons</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon, index) => (
              <HackathonCard key={index} {...hackathon} />
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="lg:col-span-1">
            <Card>
              <header className="pb-4">
                <h2 className="flex items-center gap-2 text-red-600 text-xl">
                  <AlertCircle className="w-5 h-5" />
                  Upcoming Deadlines
                </h2>
              </header>
              <div className="space-y-2">
                {deadlines.map((deadline, index) => (
                  <DeadlineItem key={index} {...deadline} />
                ))}
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <header className="pb-4">
                <h2 className="text-green-600 text-xl">Quick Actions</h2>
              </header>
              <p className="space-y-3">
                {quickActions.map((action, index) => (
                  <QuickActionButton 
                    key={index} 
                    icon={action.icon} 
                    label={action.label}
                    onClick={() => console.log(`${action.label} clicked`)}
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