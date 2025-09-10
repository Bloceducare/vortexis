"use client";

import { useState } from "react";
import useTeams from "@/hooks/useTeams";
import { useParams } from "next/navigation";
import JoinTeam from "./component/Jointeam";
import { useRouter } from "next/navigation";
import CreateTeam from "./component/CreateTeam";

import { Users, Award, Folder, FileText, Crown, Calendar } from "lucide-react";

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

export default function TeamManagement() {
  const params = useParams();
  const hackathon_id = params?.hackathon_id as string;
  const router = useRouter()
  const [pages, setPages] = useState({
    join: false,
    create: false,
  });

  const { getTeam } = useTeams();

  const toggleJoinTeamPage = () => {
    setPages({ ...pages, join: !pages.join });
  };

  const handleDeleteTeam = (id: number) => {
    console.log("Leaving team with id:", id);
  };

  const toggleCreateTeam = () => {
    setPages({ ...pages, create: !pages.create });
  }

  const goToProject =  () => {
    router.push(`/dashboard/${hackathon_id}/project`)
  }

  const { data, error: myTeamError, isLoading } = getTeam(hackathon_id);

  if (pages.join) {
    return <JoinTeam onClose={toggleJoinTeamPage} hackathon_id={hackathon_id} />;
  }

  if (pages.create) {
    return <CreateTeam onClose={toggleJoinTeamPage} hackathon_id={hackathon_id} />;
  }

  return (
    <section className="min-h-screen bg-white rounded-xl p-6">
      {isLoading && <p className="text-center">Loading your team...</p>}

      {data && (
        <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-8">
          {/* Team Header */}
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="font-bold text-2xl flex items-center gap-2 text-blue-700">
              <Crown className="w-6 h-6 text-yellow-500" />
              {data.name}
            </h2>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => handleDeleteTeam(data.id)}
            >
              Leave Team
            </button>
          </div>

          {/* Info Section */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 border p-3 rounded-lg">
              <Users className="w-5 h-5 text-gray-500" />
              <p>
                <span className="font-semibold">Organizer:</span>{" "}
                {data.organizer?.username || "Unknown"}
              </p>
            </div>

            <div className="flex items-center gap-2 border p-3 rounded-lg">
              <Calendar className="w-5 h-5 text-gray-500" />
              <p>
                <span className="font-semibold">Hackathon:</span>{" "}
                {data.hackathons && data.hackathons.length > 0
                  ? data.hackathons[0].title
                  : "N/A"}
              </p>
            </div>

            <div className="flex items-center gap-2 border p-3 rounded-lg col-span-2">
              <Users className="w-5 h-5 text-gray-500" />
              <p className="font-semibold">Members:</p>
              <div className="flex flex-wrap gap-2 ml-2">
                {data.members && data.members.length > 0 ? (
                  data.members.map((m: any) => {
                    const initials = m.username
                      ? m.username.slice(0, 2).toUpperCase()
                      : "??";
                    const color = getRandomColor();
                    return (
                      <div
                        key={m.id}
                        className="relative group cursor-pointer"
                        onClick={() =>
                          console.log("Go to profile of:", m.username)
                        }
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
                            onClick={() => console.log("View profile of:", m.username)}
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
          </div>

          <div className="grid md:grid-cols-3 gap-6">
<div className="border p-4 rounded-lg">
  <div className="flex items-center justify-between mb-2">
    <h3 className="font-semibold text-lg flex items-center gap-2">
      <Folder className="w-5 h-5 text-blue-600" /> Projects
    </h3>
    {data.projects && data.projects.length > 0 ? (
      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"  onClick={goToProject}>
        View
      </button>
    ) : (
      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"  onClick={goToProject}>
        Create
      </button>
    )}
  </div>

  {data.projects && data.projects.length > 0 ? (
    <ul className="list-disc ml-5 text-gray-700 space-y-1">
      {data.projects.map((p: any) => (
        <li key={p.id}>{p.title || "Untitled Project"}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No projects yet</p>
  )}
</div>

<div className="border p-4 rounded-lg">
  <div className="flex items-center justify-between mb-2">
    <h3 className="font-semibold text-lg flex items-center gap-2">
      <FileText className="w-5 h-5 text-green-600" /> Submissions
    </h3>
    {data.submissions && data.submissions.length > 0 ? (
      <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
        View
      </button>
    ) : (
      <button className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700">
        Create
      </button>
    )}
  </div>

  {data.submissions && data.submissions.length > 0 ? (
    <ul className="list-disc ml-5 text-gray-700 space-y-1">
      {data.submissions.map((s: any) => (
        <li key={s.id}>{s.title || "Untitled Submission"}</li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-500">No submissions yet</p>
  )}
</div>


            <div className="border p-4 rounded-lg">
              <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-purple-600" /> Prizes
              </h3>
              {data.prizes && data.prizes.length > 0 ? (
                <ul className="list-disc ml-5 text-gray-700 space-y-1">
                  {data.prizes.map((prize: any, i: number) => (
                    <li key={i}>{prize.title || "Unnamed Prize"}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">No prizes yet</p>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <p className="text-sm text-gray-500 border-t pt-4">
            <span className="font-semibold">Created at:</span>{" "}
            {new Date(data.created_at).toLocaleDateString()}
          </p>
        </div>
      )}

      {!data && !isLoading && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-gray-600">You are not in any team yet.</p>
          <div className="flex gap-4">
            <button
              onClick={toggleJoinTeamPage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
            >
              Join Team
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg" onClick={toggleCreateTeam}>
              Create Team
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
