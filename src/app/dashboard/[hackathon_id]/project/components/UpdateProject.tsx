"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { userProject } from "@/app/api/utils/interface"
import useProjects from "@/hooks/useProject"
import { useTeamStore } from "@/store/useTeamStore"
import { useUserProjectStore } from "@/store/useProjectStore"

interface UpdateProps {
  onClose: () => void;
  hackathon_id: string;
}

function  UpdateProject({ onClose, hackathon_id }: UpdateProps){
  const router = useRouter()
  const { team } = useTeamStore()
  const { updateProjectMutation } = useProjects()
  const project = useUserProjectStore((state) => state.project)

  const [formData, setFormData] = useState<userProject>({
    title: "",
    description: "",
    github_url: "",
    live_link: "",
    demo_video_url: "",
    presentation_link: "",
    team: team?.id ?? 0,
    hackathon: hackathon_id ?? 0
  })

  const [errors, setErrors] = useState<Partial<Record<keyof userProject, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  // ✅ Sync formData with store project when it loads
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title ?? "",
        description: project.description ?? "",
        github_url: project.github_url ?? "",
        live_link: project.live_link ?? "",
        demo_video_url: project.demo_video_url ?? "",
        presentation_link: project.presentation_link ?? "",
        team: team?.id ?? 0,
        hackathon: hackathon_id ?? 0
      })
    }
  }, [project, team?.id])

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
        await updateProjectMutation.mutateAsync({
            data: formData,
            id: String(project?.id), 
          })
          setSuccessMessage("🎉 Project updated successfully!")
    } catch (err: any) {
      setError(err.message || "Failed to update project.")
    }
  }

  return (
    <div className="p-6 w-full relative">
      <h1 className="text-[#605DEC] font-bold text-2xl md:text-[32px]">Update Your Project</h1>
      <form onSubmit={handleSubmit} className="space-y-6 text-start">
    {/* Title */}
    <div className="space-y-2 mt-5">
      <label className="block font-bold">Title *</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border rounded-xl px-4 py-3 outline-none "
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
        className="w-full border rounded-xl px-4 py-3 h-[40vh] resize-none outline-none "
      />
      {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
    </div>

    {/* Links Section */}
    <h2 className="text-lg font-semibold text-gray-700">Project Links</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Github URL */}
      <div className="space-y-2">
        <label className="block font-medium">Github URL *</label>
        <input
          type="url"
          name="github_url"
          value={formData.github_url}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none"
        />
        {errors.github_url && <p className="text-red-500 text-sm">{errors.github_url}</p>}
      </div>

      {/* Live Link */}
      <div className="space-y-2">
        <label className="block font-medium">Live Link</label>
        <input
          type="url"
          name="live_link"
          value={formData.live_link}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none"
        />
        {errors.live_link && <p className="text-red-500 text-sm">{errors.live_link}</p>}
      </div>

      {/* Demo Video URL */}
      <div className="space-y-2">
        <label className="block font-medium">Demo Video URL</label>
        <input
          type="url"
          name="demo_video_url"
          value={formData.demo_video_url}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none"
        />
        {errors.demo_video_url && <p className="text-red-500 text-sm">{errors.demo_video_url}</p>}
      </div>

      {/* Presentation Link */}
      <div className="space-y-2">
        <label className="block font-medium">Presentation Link</label>
        <input
          type="url"
          name="presentation_link"
          value={formData.presentation_link}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3 outline-none"
        />
        {errors.presentation_link && <p className="text-red-500 text-sm">{errors.presentation_link}</p>}
      </div>
    </div>

    {/* Submit */}
    <div className="flex justify-end items-center gap-8">

      <button onClick={() => onClose()} className="bg-gray-300 px-6 py-3 rounded-xl font-medium mt-5 cursor-pointer transition text-[#2d2828]">
        Cancel
      </button>


      <button
        type="submit"
        disabled={updateProjectMutation.isPending}
        className={`px-6 py-3 rounded-xl font-medium mt-5 cursor-pointer transition ${
          updateProjectMutation.isPending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
      >
        {updateProjectMutation.isPending ? "Updating..." : "Submit"}
      </button>
    </div>
  </form>

  {/* ✅ Error */}
  {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

  {/* ✅ Success Modal */}
  {successMessage && (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg text-center w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Success</h2>
        <p className="mb-6">{successMessage}</p>
        <button
          onClick={() => {
            setSuccessMessage(null)
            onClose()
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  )}
</div>

  )
}

export default UpdateProject
