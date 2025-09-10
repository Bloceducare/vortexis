"use client"

import React, { useState } from "react"
import { useParams } from "next/navigation"
import useProjects from "@/hooks/useProject"
import CreateProject from "./components/CreateProject"
import {
  Info,
  Github,
  Globe,
  Video,
  Presentation,
  Users,
  Calendar,
  RefreshCcw,
  Trash2,
  Pencil,
} from "lucide-react"

function Project() {
  const params = useParams()
  const hackathon_id = params?.hackathon_id as string
  const { getProject, deleteProjectMutation } = useProjects()

  const { data, isLoading } = getProject()

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null)

  if (isLoading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold mb-4">No Project Found</h2>
        <p className="mb-6 text-gray-500 max-w-md">
          You haven’t created a project yet. Start by creating one now.
        </p>
        <CreateProject />
      </div>
    )
  }

  const project = data[0]

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

  return (
    <div className="p-8 min-h-[60vh] bg-white rounded-2xl shadow-lg">
      {/* Header */}
      <h1 className="text-3xl font-bold mb-6 text-gray-900">{project.title}</h1>

      {/* Details */}
      <div className="space-y-5">
        <Detail icon={<Info size={18} />} label="Description" value={project.description} />

        <Detail
          icon={<Github size={18} />}
          label="Github"
          value={
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {project.github_url}
            </a>
          }
        />

        {project.live_link && (
          <Detail
            icon={<Globe size={18} />}
            label="Live Link"
            value={
              <a
                href={project.live_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {project.live_link}
              </a>
            }
          />
        )}

        {project.demo_video_url && (
          <Detail
            icon={<Video size={18} />}
            label="Demo Video"
            value={
              <a
                href={project.demo_video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {project.demo_video_url}
              </a>
            }
          />
        )}

        {project.presentation_link && (
          <Detail
            icon={<Presentation size={18} />}
            label="Presentation"
            value={
              <a
                href={project.presentation_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {project.presentation_link}
              </a>
            }
          />
        )}

        <Detail icon={<Users size={18} />} label="Team" value={project.team?.name} />

        <Detail
          icon={<Calendar size={18} />}
          label="Created At"
          value={new Date(project.created_at).toLocaleString()}
        />

        <Detail
          icon={<RefreshCcw size={18} />}
          label="Updated At"
          value={new Date(project.updated_at).toLocaleString()}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-10 justify-end">
        <button
          onClick={() => console.log("Update project")}
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
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Clean detail row with icon
function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gray-500 mt-1">{icon}</span>
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        <p className="text-gray-600">{value}</p>
      </div>
    </div>
  )
}

export default Project
