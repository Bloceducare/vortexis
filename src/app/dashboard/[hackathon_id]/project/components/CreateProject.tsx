"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { userProject } from "@/app/api/utils/interface"
import useProjects from "@/hooks/useProject"
import { useTeamStore } from "@/store/useTeamStore"
import LinkPreview from "@/components/LinkPreview"
import { useUserHackathonsStore } from "@/store/useUserHackathons"

interface createProps {
  hackathon_id: string
  hackathon_name: string // ✅ pass name of hackathon
}

function CreateProject({ hackathon_id, hackathon_name }: createProps) {
  const router = useRouter()
  const { team } = useTeamStore()
  const { createProjectMutation } = useProjects()
  const [formData, setFormData] = useState<userProject>({
    title: "",
    description: "",
    github_url: "",
    live_link: "",
    demo_video_url: "",
    presentation_link: "",
    team: team?.id ?? 0,
    hackathon: hackathon_id ?? 0,
  })

  const hackathon = useUserHackathonsStore((state) =>
    state.hackathons.find((h) => h.id === Number(hackathon_id))
  )

  const [errors, setErrors] = useState<Partial<Record<keyof userProject, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const isValidUrl = (url: string) => {
    if (!url) return true
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: Partial<Record<keyof userProject, string>> = {}
    if (!formData.title.trim()) newErrors.title = "Title is required"
    if (!formData.description.trim()) newErrors.description = "Description is required"
    if (!isValidUrl(formData.github_url)) newErrors.github_url = "Enter a valid GitHub URL"
    if (formData.live_link && !isValidUrl(formData.live_link)) newErrors.live_link = "Enter a valid Live link"
    if (formData.demo_video_url && !isValidUrl(formData.demo_video_url)) newErrors.demo_video_url = "Enter a valid video URL"
    if (formData.presentation_link && !isValidUrl(formData.presentation_link)) newErrors.presentation_link = "Enter a valid presentation link"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await createProjectMutation.mutateAsync(formData)
      setSuccessMessage("🎉 Project created successfully!")
      setFormData({
        title: "",
        description: "",
        github_url: "",
        live_link: "",
        demo_video_url: "",
        presentation_link: "",
        team: team?.id ?? 0,
        hackathon: hackathon_id ?? 0,
      })
    } catch (err: any) {
      setError(err.message || "Failed to create project.")
    }
  }

  return (
    <div className="p-6 w-full relative space-y-8">
      {/* Hackathon Header */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-center">
        <h1 className="text-2xl font-bold text-indigo-700">
          Create Project for {hackathon?.title}
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Linked to your team: <span className="font-medium">{team?.name}</span>
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 text-start bg-white shadow rounded-xl p-6">
        {/* Title */}
        <div className="space-y-2">
          <label className="block font-medium">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-3 outline-none"
          />
          {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <label className="block font-medium">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-3 h-[20vh] resize-none outline-none"
          />
          {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
        </div>

        {/* Github URL */}
        <div className="space-y-2">
          <label className="block font-medium">Github URL *</label>
          <input
            type="url"
            name="github_url"
            value={formData.github_url}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-3 outline-none"
          />
          {errors.github_url && <p className="text-red-500 text-sm">{errors.github_url}</p>}
        </div>

        {/* Links Section */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block font-medium">Live Link</label>
            <input
              type="url"
              name="live_link"
              value={formData.live_link}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-3 outline-none"
            />
            {errors.live_link && <p className="text-red-500 text-sm">{errors.live_link}</p>}
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Demo Video URL</label>
            <input
              type="url"
              name="demo_video_url"
              value={formData.demo_video_url}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-3 outline-none"
            />
            {errors.demo_video_url && <p className="text-red-500 text-sm">{errors.demo_video_url}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Presentation Link</label>
          <input
            type="url"
            name="presentation_link"
            value={formData.presentation_link}
            onChange={handleChange}
            className="w-full border rounded-lg px-3 py-3 outline-none"
          />
          {errors.presentation_link && <p className="text-red-500 text-sm">{errors.presentation_link}</p>}
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            {createProjectMutation.isPending ? "Submitting..." : "Submit Project"}
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {formData.title && formData.description && (
        <div className="bg-gray-50 p-6 rounded-xl shadow space-y-4 text-start">
          <h2 className="text-lg font-semibold text-gray-800 ">🔍 Preview</h2>
          <p><span className="font-medium">Title:</span> {formData.title}</p>
          <p><span className="font-medium">Description:</span> {formData.description.slice(0, 150)}</p>

          <div>
          {formData.demo_video_url && (
              <LinkPreview
                url={formData.demo_video_url}
                width="100%"
                descriptionLength={80}
                className="rounded-lg shadow"
              />
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {formData.github_url && (
              <LinkPreview
                url={formData.github_url}
                width="100%"
                descriptionLength={80}
                className="rounded-lg shadow"
              />
            )}
            {formData.live_link && (
              <LinkPreview
                url={formData.live_link}
                width="100%"
                descriptionLength={80}
                className="rounded-lg shadow"
              />
            )}
          
            {formData.presentation_link && (
              <LinkPreview
                url={formData.presentation_link}
                width="100%"
                descriptionLength={80}
                className="rounded-lg shadow"
              />
            )}
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[90%] max-w-md">
            <h2 className="text-xl font-bold mb-4">Success</h2>
            <p className="mb-6">{successMessage}</p>
            <button
              onClick={() => {
                setSuccessMessage(null)
                window.location.reload()
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateProject


