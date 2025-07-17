"use client";
import { HackathonDetailCard } from "@/components/dashboard/HackathonDetailCard";
import { useState } from "react";


const TabMenu = ["active", "upcoming", "past"];

const Hackathons = () => {
  const [activeTab, setActiveTab] = useState<string>("active");

  const activeHackathons = [
    {
      title: "AI Innovation Challenge",
      description: "Build the next generation of AI tools for developers",
      status: "in progress" as const,
      deadline: "May 12, 2025",
      progress: 45
    },
    {
      title: "AI Innovation Challenge",
      description: "Build the next generation of AI tools for developers",
      status: "in progress" as const,
      deadline: "May 12, 2025",
      progress: 45
    },
    {
      title: "AI Innovation Challenge",
      description: "Build the next generation of AI tools for developers",
      status: "in progress" as const,
      deadline: "May 12, 2025",
      progress: 45
    }
  ];

  const upcomingHackathons = [
    {
      title: "Web3 Development Challenge",
      description: "Create innovative decentralized applications",
      status: "upcoming" as const,
      deadline: "June 15, 2025",
      progress: 0
    },
    {
      title: "Mobile App Innovation",
      description: "Design and build the next big mobile application",
      status: "upcoming" as const,
      deadline: "July 20, 2025",
      progress: 0
    }
  ];

  const pastHackathons = [
    {
      title: "Fintech Revolution",
      description: "Transform the financial technology landscape",
      status: "completed" as const,
      deadline: "March 10, 2025",
      progress: 100
    },
    {
      title: "Healthcare Tech Challenge",
      description: "Develop solutions for modern healthcare challenges",
      status: "completed" as const,
      deadline: "February 28, 2025",
      progress: 100
    }
  ];

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">My Hackathons</h1>
        </div>

        <div className="w-full">
          <div className="grid w-full grid-cols-3">
            {TabMenu.map((tab, index) => (
              <button key={index} type="button" onClick={() => setActiveTab(tab)} value="active">{tab}</button>
            ))}
          </div>

          {activeTab === "active" &&
            <div className="space-y-4 mt-6">
              {activeHackathons.map((hackathon, index) => (
                <HackathonDetailCard key={index} {...hackathon} />
              ))}
            </div>
          }

          {activeTab === "upcoming" &&
            <div className="space-y-4 mt-6">
              {upcomingHackathons.map((hackathon, index) => (
                <HackathonDetailCard key={index} {...hackathon} />
              ))}
            </div>
          }
          {activeTab === "past" &&
            <div className="space-y-4 mt-6">
              {pastHackathons.map((hackathon, index) => (
                <HackathonDetailCard key={index} {...hackathon} />
              ))}
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default Hackathons;