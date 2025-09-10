"use client"

import React from "react"
import { useParams } from "next/navigation"
import useProjects from "@/hooks/useProject"
import CreateProject from "./components/CreateProject"

function Project() {
  const params = useParams()
  const hackathon_id = params?.hackathon_id as string
  const { getProject } = useProjects()

  const { data, isLoading } = getProject()

  if (isLoading) {
    return <div className="p-6 text-center">Loading...</div>
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center bg-white rounded-2xl">
        <h2 className="text-xl font-semibold mb-4">No Project Found</h2>
        <p className="mb-6 text-gray-600">
          You haven’t created a project yet. Start by creating one now.
        </p>
        <CreateProject />
      </div>
    )
  }


  const project = data[0]

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{project.title}</h1>

      <div className="space-y-3">
        <p>
          <span className="font-medium">ID:</span> {project.id}
        </p>
        <p>
          <span className="font-medium">Description:</span> {project.description}
        </p>
        <p>
          <span className="font-medium">Github URL:</span>{" "}
          <a
            href={project.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {project.github_url}
          </a>
        </p>

        {project.live_link && (
          <p>
            <span className="font-medium">Live Link:</span>{" "}
            <a
              href={project.live_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {project.live_link}
            </a>
          </p>
        )}

        {project.demo_video_url && (
          <p>
            <span className="font-medium">Demo Video:</span>{" "}
            <a
              href={project.demo_video_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {project.demo_video_url}
            </a>
          </p>
        )}

        {project.presentation_link && (
          <p>
            <span className="font-medium">Presentation:</span>{" "}
            <a
              href={project.presentation_link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              {project.presentation_link}
            </a>
          </p>
        )}

        <p>
          <span className="font-medium">Team:</span> {project.team}
        </p>
        <p>
          <span className="font-medium">Created At:</span>{" "}
          {new Date(project.created_at).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Updated At:</span>{" "}
          {new Date(project.updated_at).toLocaleString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={() => console.log("Update project")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Update
        </button>
        <button
          onClick={() => console.log("Delete project")}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export default Project
