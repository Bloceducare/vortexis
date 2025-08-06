"use client"
import { HackathonCard } from "./HackathonCard";
import { useHackathonStore } from '@/store/useHackathonStore';


export const HackathonList = () => {
  const hackathons = useHackathonStore((state) => state.hackathons);
  const totals = hackathons?.reduce(
    (acc, hackathon) => {
      acc.totalParticipants += hackathon.participants?.length || 0;
      acc.totalJudges += hackathon.judges?.length || 0;
      acc.totalSubmissions += hackathon.submissions?.length || 0;
      return acc;
    },
    { totalParticipants: 0, totalJudges: 0, totalSubmissions: 0 }
  );
  

    return (
      <div className="">
     {/* Header */}
<div className="bg-gradient-to-r from-[#0b5b90] to-[#00c2ff] text-white">
  <div className="container mx-auto px-4 py-16">
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">
        Your Amazing Hackathons
      </h1>
      <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-6">
        View and Control your Hackathons
      </p>

      <a
        href="organizer/create-hackathon"
        className="inline-block bg-white text-[#009aff] font-semibold px-6 py-3 rounded-full shadow-md hover:bg-gray-100 transition"
      >
        + Create Hackathon
      </a>
    </div>
  </div>
</div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">{hackathons?.length}</div>
              <div className="text-sm text-gray-500">Total Hackathons</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">{totals?.totalParticipants}</div>
              <div className="text-sm text-gray-500">Total Participants</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">{totals?.totalJudges}</div>
              <div className="text-sm text-gray-500">Total Judges</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-md">
              <div className="text-2xl font-bold text-[#009aff]">{totals?.totalSubmissions}</div>
              <div className="text-sm text-gray-500">Total Submissions</div>
            </div>
          </div>
  
          {/* Hackathon Grid */}
          {hackathons?.length > 0 ?  (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">      
            {hackathons?.map((hackathon) => (
              <HackathonCard key={hackathon.id} hackathon={hackathon} />
            ))}
          </div>
          ) : (
            <div className="flex flex-col justify-center items-center gap-4 mt-10" >
              <p className="text-[#a09393] text-2xl">No Hackathon Created</p>
              <a
                  href="/organizer/create-hackathon"
                  className="inline-block mt-3 px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded text-sm"
                >
                  + Create new hackathon
                </a>
             </div>
          )}
        </div>
      </div>
    );
  };