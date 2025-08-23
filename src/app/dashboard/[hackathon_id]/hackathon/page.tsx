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

const Hackathons = () => {
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;


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
          {data.participants?.length === 0 ? (
            <div className="flex gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Create Team
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                Join Team
              </button>
            </div>
          ) : (
            <div>
              <p className="text-gray-600">
                You are in <span className="font-bold">Team Alpha</span>
              </p>
              <ul className="list-disc pl-5 text-gray-600">
                <li>User A</li>
                <li>User B</li>
              </ul>
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
