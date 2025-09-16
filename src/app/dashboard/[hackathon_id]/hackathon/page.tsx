"use client";

import { useParams } from "next/navigation";
import useHackathon from "@/hooks/useHackathon";
import HtmlContent from "@/components/ui/HtMLContent";
import {
  MapPin,
  Trophy,
  FileText,
  Calendar,
  CheckCircle,
} from "lucide-react";
import useTeams from "@/hooks/useTeams";
import { useRouter } from "next/navigation";


const Hackathons = () => {
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;
  const router = useRouter()

  const getRandomColor = () => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

    const { getTeam } = useTeams();

    const { data: myTeam, error: myTeamError, } = getTeam(hackathon_id);
    console.log(myTeam)
  


  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      year: "numeric",
    };
    return new Date(dateStr).toLocaleDateString("en-US", options);
  };

  const { getHackathonById } = useHackathon();
  const { data, isLoading, error } = getHackathonById(hackathon_id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white rounded-xl p-6">
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-1/3 bg-gray-200 rounded"></div>
          <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-40 w-full bg-gray-200 rounded-lg"></div>
          <div className="h-12 w-1/4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Failed to load hackathon details.</p>
      </div>
    );
  }

  const {
    grand_prize,
  } = data;

  return (
    <div className="min-h-screen bg-white rounded-xl p-6">
      <div className="px-6 mx-auto space-y-8">
        {/* Title */}
        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">{data?.title}</h1>
          <HtmlContent html={data?.description} />
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-50 rounded-xl space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-5 h-5 text-blue-500" />
              <span className="font-bold">Venue</span>
              <span>{data?.venue}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Calendar className="w-5 h-5 text-green-500" />
              <span>
                <span className="font-bold"> Date: </span>
              {formatDate(data.start_date)} – {formatDate(data.end_date)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <FileText className="w-5 h-5 text-red-500" />
              <span>
              <span className="font-bold"> Submission Deadline:{" "}</span> 
                {formatDate(data?.submission_deadline)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-700">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="font-bold">Grand Prize: </span>
              <span>${data?.grand_prize}</span>
            </div>
          </div>

          <div className="p-6 bg-gray-50 rounded-xl space-y-4">
            <h2 className="font-semibold text-lg">Rules</h2>
            <div className="w-1/2">
            <HtmlContent html={JSON.parse(data?.rules).join("")} />
            </div>
          </div>
        </div>

        {/* Prizes */}
        <div className="p-6 bg-gray-50 rounded-xl">
          <h2 className="font-semibold text-lg mb-2">Prizes</h2>
        
          <HtmlContent html={JSON.parse(data?.prizes).join("")} />

        </div>

        {/* Team Management */}
        <div className="p-6 bg-gray-50 rounded-xl space-y-4">
          <h2 className="font-semibold text-lg">Your Team</h2>
          {myTeam ? (
          <div>
          <p className="text-gray-600">
            You are in <span className="font-bold"> {myTeam.name}</span>
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
                {myTeam.members && myTeam.members.length > 0 ? (
                  myTeam.members.map((m: any) => {
                    const initials = m.username
                      ? m.username.slice(0, 2).toUpperCase()
                      : "??";
                    const color = getRandomColor();
                    return (
                      <div
                        key={m.id}
                        className="relative group cursor-pointer"
                        onClick={() => router.push(`/profile/${myTeam.id}`)}

                      >
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${color}`}
                        >
                          {initials}
                        </div>
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition 
                                        bg-white shadow-lg border border-gray-200 text-black rounded-lg px-3 py-2 
                                        whitespace-nowrap z-10 w-max min-w-[120px]">
                          <p className="font-semibold text-gray-800 text-sm">{m.username}</p>

                          <div className="my-1 border-t border-gray-200"></div>

                          <button
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1"
                            onClick={() => router.push(`/profile/${myTeam.id}`)}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No members yet</p>
                )}
              </div>
          </div>
          
          ) : (
            <div className="flex gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer" onClick={() => router.push(`/dashboard/${hackathon_id}/team`)}>
              Create Team
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"  onClick={() => router.push(`/dashboard/${hackathon_id}/team`)}>
              Join Team
            </button>
          </div>
          )}
        </div>

        {/* Extra Details */}
        {/* <div className="p-6 bg-gray-50 rounded-xl">
          <h2 className="font-semibold text-lg">About</h2>
          <HtmlContent html={data?.description} />
        </div> */}
      </div>
    </div>
  );
};

export default Hackathons;
