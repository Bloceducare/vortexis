"use client"
import { HackathonCard } from "./HackathonCard";
import { useHackathonStore } from '@/store/useHackathonStore';


export const HackathonList = () => {
  const hackathons = useHackathonStore((state) => state.hackathons);

    return (
      <div className="">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#009aff] to-[#00c2ff] text-white">
          <div className="container mx-auto px-4 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Your Amazing Hackathons
              </h1>
              <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
               View and Control your Hackathons
              </p>
            </div>
          </div>
        </div>
  
        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">{hackathons.length}</div>
              <div className="text-sm text-gray-500">Total Hackathons</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">{}</div>
              <div className="text-sm text-gray-500">Total Participants</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]"></div>
              <div className="text-sm text-gray-500">Total Judges</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]"></div>
              <div className="text-sm text-gray-500">Total Submissions</div>
            </div>
          </div>
  
          {/* Hackathon Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hackathons.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
        </div>
      </div>
    );
  };