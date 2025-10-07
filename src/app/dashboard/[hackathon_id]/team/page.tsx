"use client";

import { useState } from "react";
import useTeams from "@/hooks/useTeams";
import { useParams } from "next/navigation";
import JoinTeam from "./component/Jointeam";
import { useRouter } from "next/navigation";
import CreateTeam from "./component/CreateTeam";
import TeamIcon from "@/public/assets/icon/ant-design_team-outlined.svg"
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {Card} from "@/components/ui/card";
import {  Github, FileText, Book, Folder } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useUserHackathonsStore } from "@/store/useUserHackathons";
import { useUserStore } from "@/store/useUserStore";



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
    const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)
    const [addModal, setAddModal] = useState<boolean>(false)
    const [newMember, setNewMember] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMember(e.target.value);
  };


  const { getTeam, leaveTeam, inviteMembers } = useTeams();
       const hackathonData = useUserHackathonsStore((state) =>
          state.hackathons.find((h) => h.id === Number(hackathon_id))
        )

  const toggleJoinTeamPage = () => {
    setPages({ ...pages, join: !pages.join });
  };


  const leaveTeamMutation = leaveTeam();
  const inviteMemberMutation = inviteMembers()


  
  const handleLeaveTeam = async (id: number) => {
    try {
      await leaveTeamMutation.mutateAsync(String(id));
      console.log("Left team successfully");
      setFeedback({
        type: "success",
        message: `Left ${data.name} team Successfully.`,
      });
    } catch (error: any) {
      setFeedback({
        type: "error",
        message: error?.message || "Unable to leave the team please try again later.",
      });
    }
  };  

  const toggleCreateTeam = () => {
    setPages({ ...pages, create: !pages.create });
  }

  const goToProject =  () => {
    router.push(`/dashboard/${hackathon_id}/project`)
  }

  const { data, error: myTeamError, isLoading } = getTeam(hackathon_id);
  console.log(data)

  const handleAddMember = async () => {
    if (!newMember.trim()) {
      alert("Please enter a member email");
      return;
    }

    try {
      await inviteMemberMutation.mutateAsync({
        team_id: data.id,
        member_email: newMember,
      });
      alert("Member invited successfully!");
      setNewMember("");
    } catch (err: any) {
      alert(err.message || "Failed to invite member");
    } finally {
      setAddModal(false);
    }
  };

   const user = useUserStore((state) => state.user);
  const currentMember = data?.members.find(
    (member: any) => member.id === user?.id
  );

  const isCreator = currentMember?.is_creator;

  if (pages.join) {
    return <JoinTeam onClose={toggleJoinTeamPage} hackathon_id={hackathon_id} />;
  }

  if (pages.create) {
    return <CreateTeam onClose={toggleCreateTeam} hackathon_id={hackathon_id} />;
  }

  return (
    <section className="min-h-screen bg-white rounded-xl p-6">
      <div>
        <h1 className="text-[#605DEC] text-xl md:text-[32px] font-bold">Team Workspace</h1>
        <p>Collaborate with your team members!</p>
      </div>
      {isLoading && <p className="text-center">Loading your team...</p>}

      {data && (
        <div className=" p-6 bg-white space-y-8 mt-10">

          <section className="flex gap-5 items-start">
            <section className="bg-white shadow-xs border-[#E2E8F0] border-2 rounded-2xl px-6 py-3 w-[54%]">
              <div className="space-y-3">
              <h1 className="font-semibold text-2xl text-[#1E1E1E]">Team: {data.name}</h1>
              <p>Working on  {data.hackathon 
                  ? data.hackathon.title
                  : "N/A"} hackathon</p>
              </div>

              <h1 className="text-xl text-[#605DEC] font-normal mt-8">Team Members</h1>

          
              <div className="flex flex-wrap justify-between my-5">
                {data.members && data.members.length > 0 ? (
                  data.members.map((m: any) => {
                    const initials = m.username
                      ? m.username.slice(0, 2).toUpperCase()
                      : "??";
                    const color = getRandomColor();
                    return (
                      <div
                        key={m.id}
                        className="relative group cursor-pointer w-[48%]"
                        onClick={() => router.push(`/profile/${m.id}`)}

                      >
                        <div className="flex gap-2 border-2 border-[#605DEC] rounded-lg px-4 py-2 items-center ">
                        <div
                          className={`w-10 h-10 flex items-center justify-center rounded-full text-white font-bold ${color}`}
                        >
                          {initials}
                        </div>
                        <div>
                        <p className="font-semibold text-gray-800 text-sm">{m.username}</p>
                        </div>
                        </div>
                        <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition 
                                        bg-white shadow-lg border border-gray-200 text-black rounded-lg px-3 py-2 
                                        whitespace-nowrap z-10 w-max min-w-[120px]">
                          <p className="font-semibold text-gray-800 text-sm">{m.username}</p>

                          <div className="my-1 border-t border-gray-200"></div>

                          <button
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium mt-1 cursor-pointer"
                            onClick={() => router.push(`/profile/${m.id}`)}
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

          

                <div className="mt-10">
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
                <div className=" ml-5 text-gray-700 space-y-1">
                  {data.projects.map((p: any) => (
                    <p key={p.id}>{p.title || "Untitled Project"}</p>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No projects yet</p>
              )}
            </div>
            </section>

            <section className="w-[40%]">
                 <Card>
                            <div className="p-6">
                              <h2 className="text-lg font-semibold text-blue-600 mb-4">Project Resources</h2>
                              <div className="space-y-3">
                                <Button
                                  variant="outline"
                                  className="w-full flex justify-start gap-3 h-12"
                                >
                                  <Github className="w-5 h-5" />
                                  GitHub Repository
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full flex justify-start gap-3 h-12"
                                >
                                  <FileText className="w-5 h-5" />
                                  Project Docs
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full flex justify-start gap-3 h-12"
                                >
                                  <Book className="w-5 h-5" />
                                  API Documentation
                                </Button>
                              </div>
                            </div>
                          </Card>


                          <section className="bg-white shadow-xs rounded-2xl p-6 mt-3">
  <h2 className="text-lg font-semibold text-blue-600 mb-3">Actions</h2>
  <div className="flex justify-between items-center gap-4">
  {isCreator && (
  <button
    className="px-4 py-3 border-2 border-[#605DEC] text-[#605DEC] font-bold rounded-lg cursor-pointer w-[48%]"
    onClick={() => setAddModal(true)}
  >
    + Invite Member
  </button>
)}

    <button
      className="px-4 py-3 bg-red-500 text-white rounded-lg cursor-pointer w-[48%]"
      onClick={() => handleLeaveTeam(data.id)}
    >
      {leaveTeamMutation.isPending ? "Leaving..." : "Leave Team"}
    </button>
  </div>
</section>

              
            </section>

          </section>

          {addModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 h-[100vh]">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md relative">
            <button
              onClick={() => setAddModal(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">Invite Member</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newMember}
                onChange={handleChange}
                placeholder="Enter member name"
                className="border p-2 rounded-lg flex-1"
              />
              <button
                onClick={handleAddMember}
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
              >
                Invite
              </button>
            </div>
          </div>
        </div>
      )}
        
        </div>
      )}

      {!data && !isLoading && (
        <section className="bg-white shadow-xs border-[#E2E8F0] border-2 rounded-2xl px-6 py-7 mt-4">

          <div className="space-y-3">
            <h1 className="text-[#00AC4F] text-2xl font-semibold">Create New Team</h1>
            <p>You haven't created or joined a team for this hackathon yet.</p>
          </div>

          <section className="flex flex-col items-center justify-center gap-8 mt-10">
            <div className="flex flex-col items-center justify-center gap-4">
              <Image src={TeamIcon} alt="img-icon" />

              <h1 className="text-[#212121] font-semibold text-2xl">Create New Team</h1>

              <p className="text-[#727272] text-center text-lg leading-8">Create a team or join an existing one to collaborate with other  <br />
              participants for the <b>{hackathonData?.title}</b>  Hackathon.</p>
            </div>


            <div className="flex gap-5 justify-center">
            <button className="px-7 py-3 bg-[#3D3ACE] text-white rounded-sm flex gap-3 items-center cursor-pointer" onClick={toggleCreateTeam}>
              Create Team
              <ArrowRight />
            </button>

            <button
              onClick={toggleJoinTeamPage}
              className="px-7 py-3 border-[#605DEC] border-2 text-[#605DEC] rounded-lg cursor-pointer flex gap-3 items-center"
            >
              Join Team
              <ArrowRight />
            </button>

            </div>
          </section>

        </section>

       
      )}


        {/* Feedback Modal */}
        {feedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2
              className={`text-lg font-semibold mb-3 ${
                feedback.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {feedback.type === "success" ? "Success" : "Error"}
            </h2>
            <p className="text-gray-700 mb-6">{feedback.message}</p>
            <button
              onClick={() => setFeedback(null)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
