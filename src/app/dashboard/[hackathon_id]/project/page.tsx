"use client";

import React, { useState } from "react";
import useProjects from "@/hooks/useProject";
import CreateProject from "./components/CreateProject";
import {
  Info,
  Users,
  Calendar,
  RefreshCcw,
  Trash2,
  Pencil,
} from "lucide-react";
import { useUserProjectStore } from "@/store/useProjectStore";
import UpdateProject from "./components/UpdateProject";
import LinkPreview from "@/components/LinkPreview";
import useHackathon from "@/hooks/useHackathon";
import { useTeamStore } from "@/store/useTeamStore";
import Countdown from "@/components/ui/Countdown";
import StatusModal from "@/components/StatusModal";
import { useHackathonStore } from "@/store/useHackathonStore";


function Project() {
const activeHackathon = useHackathonStore((state) => state.activeHackathon);
    const hackathon_id = activeHackathon?.id as string;  
      const { getProject, deleteProjectMutation, submitProjectMutation } =
    useProjects();
  const [update, setUpdate] = useState(false);

  const { data, isLoading } = getProject();

  const { getHackathonById } = useHackathon();
  const {
    data: hackathonData,
    isLoading: loadingHackathon,
    error,
  } = getHackathonById(hackathon_id);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [modal, setModal] = useState<{
      open: boolean;
      type: "success" | "error";
      message: string;
      title?: string;
    }>({
      open: false,
      type: "success",
      message: "",
    });
  

  const handleSubmitProject = async (project_id: number) => {
    try {
      await submitProjectMutation.mutateAsync({
        project: project_id,
        hackathon_id,
      });
  setModal({
        open: true,
        type: "success",
        message: `Project has been submitted successfully!`,
        title: "Team Created! 🎉",
      });
    } catch (error: any) {
      setModal({
        open: true,
        type: "error",
        message: `${error}`,
        title: "Unable to submit Project🎉",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center text-gray-600 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  const team = useTeamStore.getState().team;

  const project = data?.find((proj: any) => proj.team?.id === team?.id);

  if (project) {
    useUserProjectStore.getState().setProject(project);
  }

  if (!project || project.length === 0) {
    return (
      <div className="p-3 md:p-6 flex flex-col items-center justify-center min-h-[60vh] text-center bg-white dark:bg-gray-800 rounded-2xl shadow-md transition-colors">
        <h2 className="text-2xl font-bold mb-4 dark:text-white">
          No Project Found
        </h2>
        <p className="mb-6 text-gray-500 dark:text-gray-400 max-w-md">
          You haven’t created a project yet. Start by creating one now.
        </p>
        <CreateProject
          hackathon_id={hackathon_id}
          hackathon_name={hackathonData?.title}
        />
      </div>
    );
  }

  if (update) {
    return (
      <div className="p-3 md:p-8 min-h-[60vh] bg-white dark:bg-gray-800 rounded-2xl shadow-lg transition-colors">
        <UpdateProject
          onClose={() => setUpdate(false)}
          hackathon_id={hackathon_id}
        />
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      await deleteProjectMutation.mutateAsync(project.id);
     setModal({
        open: true,
        type: "success",
        message: `Project has been deleted successfully!`,
        title: "Team Created! 🎉",
      });
    } catch (error: any) {
      setModal({
        open: true,
        type: "error",
        message: `${error}`,
        title: "Unable to delete 🎉",
      });
    } finally {
      setShowDeleteModal(false);
    }
  };

    const handleModalClose = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };


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
      month: "long", // October
      day: "numeric", // 10
    });
  };

  return (
    <div className="p-3 md:p-8 min-h-[60vh] bg-white dark:bg-gray-800 rounded-2xl transition-colors">
      <h1 className="text-[#605DEC] dark:text-indigo-400 font-bold text-2xl md:text-[32px]">
        Manage Your Project
      </h1>

      <section className="flex justify-between mt-10 gap-5 flex-wrap-reverse md:flex-nowrap">
        <section className="bg-white dark:bg-gray-800 shadow-xs border-[#E2E8F0] dark:border-gray-700 border-2 rounded-2xl px-2 md:px-6 py-3 md:w-[64%] transition-colors">
          <div className="space-y-2">
            <h1 className="text-[#AC0000] dark:text-red-400 text-xl md:text-2xl font-semibold">
              Project Details
            </h1>
            <p className="dark:text-gray-300 text-sm md:text-lg">
              Get more Information about your project
            </p>
          </div>

          <div className="space-y-5 mt-3">
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
              {project?.title.charAt(0).toUpperCase() + project?.title.slice(1)}
            </h1>

            {/* Description */}
            <Detail
              icon={<Info size={18} />}
              label="Description"
              value={project?.description}
            />

            <div>
              {project?.demo_video_url && (
                <div>
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Demo Video
                  </h3>
                  <LinkPreview
                    url={project?.demo_video_url}
                    width="100%"
                    descriptionLength={80}
                    className="rounded-lg shadow"
                  />
                </div>
              )}
            </div>

            <div className="mt-3 flex justify-center gap-3 flex-col flex-wrap">
              {project?.github_url && (
                <div className="">
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 ">
                    GitHub
                  </h3>
                  <LinkPreview
                    url={project?.github_url}
                    width="100%"
                    descriptionLength={80}
                    className="rounded-lg shadow"
                  />
                </div>
              )}

              {project?.live_link && (
                <div className="">
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 ">
                    Live Link
                  </h3>
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
                  <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2 ">
                    Presentation
                  </h3>
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

        <section className=" md:w-[35%]">
          <section className="bg-white dark:bg-gray-800 shadow-xs border-[#E2E8F0] dark:border-gray-700 border-2 rounded-2xl px-6 py-3 transition-colors">
            <h1 className="text-[#00AC4F] dark:text-green-400 font-semibold text-2xl">
              Submission Deadline
            </h1>

            <section className="rounded-xl bg-[#DC262612] dark:bg-red-900/20 text-center py-5 px-4 mt-4 transition-colors">
              <div className="space-y-3 ">
                <h1 className="font-semibold dark:text-white">
                  Deadline Approaching
                </h1>
                <p className="text-[#DC2626] dark:text-red-400">
                  {hackathonData?.title} hackathon submissions{" "}
                  {getDeadlineMessage(hackathonData?.submission_deadline)}
                </p>
              </div>
            </section>

       <div className="mt-5 space-y-2">
  <p className="text-[#605DEC] dark:text-indigo-400 font-semibold text-xl">
    {hackathonData?.title}
  </p>

  <p className="text-[#AC0000] dark:text-red-400 font-medium">
    {hackathonData?.submission_deadline ? (
      <>
        Time left to submit: <Countdown startDate={hackathonData.submission_deadline} />
      </>
    ) : (
      "Submission deadline not available"
    )}
  </p>
</div>

          </section>

          <section className="bg-white dark:bg-gray-800 shadow-xs border-[#E2E8F0] dark:border-gray-700 border-2 rounded-2xl px-6 py-5 mt-10 transition-colors">
            <div className="flex flex-col space-y-4">
              <Detail
                icon={<Users size={18} />}
                label="Team"
                value={project?.team?.name}
              />
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

      <div className="flex gap-4 mt-10 justify-end flex-wrap">
    {!project.is_submitted && (  <button
          className={`flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium shadow transition cursor-pointer ${
            submitProjectMutation.isPending
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={() => handleSubmitProject(project.id)}
          disabled={submitProjectMutation.isPending}
        >
          {submitProjectMutation.isPending ? "Submitting..." : "Submit Project"}
        </button>)}

      {new Date(hackathonData?.submission_deadline) > new Date() && (
  <button
    onClick={() => setUpdate(true)}
    className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 text-white font-medium shadow hover:bg-blue-700 transition cursor-pointer"
  >
    <Pencil size={18} /> Update
  </button>
)}

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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg max-w-sm w-full text-center transition-colors">
            <h2 className="text-lg font-semibold mb-3 dark:text-white">
              Delete Project?
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold">{project.title}</span>? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

       <StatusModal
          isOpen={modal.open}
          onClose={handleModalClose}
          type={modal.type}
          message={modal.message}
          title={modal.title}
        />
    </div>

    
  );
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
      <span className="text-gray-500 dark:text-gray-400 mt-1">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label}
        </p>
        <p className="text-gray-600 dark:text-gray-400">
          {displayValue}
          {isLong && !expanded && "..."}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline mt-1"
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Project;
