"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import useProjects from "@/hooks/useProject"
import CreateProject from "./components/CreateProject"
import {
  Info,
  Users,
  Calendar,
  RefreshCcw,
  Trash2,
  Pencil,
} from "lucide-react"
import { useUserProjectStore } from "@/store/useProjectStore";
import UpdateProject from "./components/UpdateProject"
import LinkPreview from "@/components/LinkPreview"
import useHackathon from "@/hooks/useHackathon"
import { useTeamStore } from "@/store/useTeamStore"


function Project() {
  const params = useParams()
  const hackathon_id = params?.hackathon_id as string
  const { getProject, deleteProjectMutation, submitProjectMutation  } = useProjects()
  const [update, setUpdate] = useState(false)

  const { data, isLoading } = getProject()

  const { getHackathonById } = useHackathon();
    const { data: hackathonData, isLoading: loadingHackathon, error } = getHackathonById(hackathon_id);

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  const handleSubmitProject = async (project_id: number) => {
    try {
      await submitProjectMutation.mutateAsync({
        project: project_id,
        hackathon_id,
      });
    
      setFeedback({
        type: "success",
        message: "Project submitted successfully.",
      });
    } catch (error: any) {
    
      setFeedback({
        type: "error",
        message: error?.message || "Failed to submit project.",
      });
    }
  };
  

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>
  }

 

  const team = useTeamStore.getState().team;


const project = data?.find((proj: any) => proj.team?.id === team?.id);

if (project) {
  useUserProjectStore.getState().setProject(project);
}


if (!project || project.length === 0) {
  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">No Project Found</h2>
      <p className="mb-6 text-gray-500 max-w-md">
        You haven’t created a project yet. Start by creating one now.
      </p>
      <CreateProject hackathon_id={hackathon_id} hackathon_name={hackathonData?.title} />
    </div>
  )
}



  if(update) {
    return (
      <div className="p-8 min-h-[60vh] bg-white rounded-2xl shadow-lg">

    <UpdateProject onClose={() => setUpdate(false)} hackathon_id={hackathon_id} />
    </div>
    )
  }

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id)
      setFeedback({ type: "success", message: "Project deleted successfully." })
    } catch (error: any) {
      setFeedback({ type: "error", message: error.message || "Failed to delete project." })
    } finally {
      setShowDeleteModal(false)
    }
  }

  const getDeadlineMessage = (deadlineString: string) => {
    const deadline = new Date(deadlineString);
    const now = new Date();
    const diffMs = deadline.getTime() - now.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  
    if (days > 1) return `due in ${days} days`;
    if (days === 1) return "due tomorrow";
    if (days === 0) return "due today";
    return "deadline passed";
  };

  const formatDeadline = (deadlineString: string) => {
    const date = new Date(deadlineString);
    return date.toLocaleDateString("en-US", {
      weekday: "long", // Saturday
      year: "numeric", // 2026
      month: "long",   // October
      day: "numeric",  // 10
    });
  };
  
  
  return (
    <div className="p-8 min-h-[60vh] bg-white rounded-2xl ">

      <h1 className="text-[#605DEC] font-bold text-2xl md:text-[32px]">Manage Your Project</h1>

      <section className="flex justify-between mt-10 gap-5">

      <section className="bg-white shadow-xs border-[#E2E8F0] border-2 rounded-2xl px-6 py-3 w-[64%]">
  <div className="space-y-2">
    <h1 className="text-[#AC0000] text-xl md:text-2xl font-semibold">Project Details</h1>
    <p>Get more Information about your project</p>
  </div>

  <div className="space-y-5 mt-3">
  <h1 className="text-3xl font-bold mb-6 text-gray-900">
  {project?.title.charAt(0).toUpperCase() + project?.title.slice(1)}
</h1>

    {/* Description */}
    <Detail icon={<Info size={18} />} label="Description" value={project?.description} />


    <div>
    {project?.demo_video_url && (
    <div>
      <h3 className="text-xl font-bold text-gray-700 mb-2">Demo Video</h3>
      <LinkPreview
        url={project?.demo_video_url}
        width="100%"
        descriptionLength={80}
        className="rounded-lg shadow"
      />
    </div>
  )}
    </div>

<div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
  {project?.github_url && (
    <div>
      <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">GitHub</h3>
      <LinkPreview
        url={project?.github_url}
        width="100%"
        descriptionLength={80}
        className="rounded-lg shadow"
      />
    </div>
  )}

  {project?.live_link && (
    <div>
      <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">Live Link</h3>
      <LinkPreview
        url={project?.live_link}
        width="100%"
        descriptionLength={80}
        className="rounded-lg shadow"
      />
    </div>
  )}

 

  {project?.presentation_link && (
    <div>
      <h3 className="text-xl font-bold text-gray-700 mb-2 text-center">Presentation</h3>
      <LinkPreview
        url={project?.presentation_link}
        width="100%"
        descriptionLength={80}
        className="rounded-lg shadow"
      />
    </div>
  )}
</div>  
  </div>
</section>


          <section className="w-[35%]">


          <section className="bg-white shadow-xs border-[#E2E8F0] border-2 rounded-2xl px-6 py-3">
            <h1 className="text-[#00AC4F] font-semibold text-2xl">Submission Deadline</h1>


            <section className="rounded-xl bg-[#DC262612] text-center py-5 px-4 mt-4">
              <div className="space-y-3 ">
                <h1 className="font-semibold">Deadline Approaching</h1>
                <p className="text-[#DC2626]">
                  {hackathonData?.title} hackathon submissions {getDeadlineMessage(hackathonData?.submission_deadline)}
                </p>
              </div>
            </section>


            <div className="mt-5 space-y-2">
            <p className="text-[#605DEC] font-semibold text-xl">{hackathonData?.title}</p>

            <p className="text-[#AC0000]">
  Deadline: {formatDeadline(hackathonData?.submission_deadline)}
</p>

            </div>


           
            </section>




            <section className="bg-white shadow-xs border-[#E2E8F0] border-2 rounded-2xl px-6 py-5 mt-10">
  <div className="flex flex-col space-y-4">
    <Detail icon={<Users size={18} />} label="Team" value={project?.team?.name} />
    <Detail
      icon={<Calendar size={18} />}
      label="Created At"
      value={new Date(project?.created_at).toLocaleString()}
    />
    <Detail
      icon={<RefreshCcw size={18} />}
      label="Updated At"
      value={new Date(project?.updated_at).toLocaleString()}
    />
  </div>
</section>

          </section>


      </section>



      <div className="flex gap-4 mt-10 justify-end">
      <button
  className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium shadow transition cursor-pointer ${
    submitProjectMutation.isPending
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-green-700"
  }`}
  onClick={() => handleSubmitProject(project.id)}
  disabled={submitProjectMutation.isPending}
>
  {submitProjectMutation.isPending ? "Submitting..." : "Submit Project"}
</button>

        <button
          onClick={() => setUpdate(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition cursor-pointer"
        >
          <Pencil size={18} /> Update
        </button>
        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-red-600 text-white font-medium shadow hover:bg-red-700 transition cursor-pointer"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 bg-opacity-40 z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">
            <h2 className="text-lg font-semibold mb-3">Delete Project?</h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <span className="font-bold">{project.title}</span>? This
              action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete} // ✅ FIXED onClick
                disabled={deleteProjectMutation.isPending}
                className={`px-4 py-2 rounded-lg text-white cursor-pointer ${
                  deleteProjectMutation.isPending
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {deleteProjectMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}     
    </div>
  )
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = value.length > 150;

  const displayValue = expanded ? value : value.slice(0, 150);

  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-500 mt-1">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-gray-600">
          {displayValue}
          {isLong && !expanded && "..."}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 text-sm font-medium hover:underline mt-1"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Project
