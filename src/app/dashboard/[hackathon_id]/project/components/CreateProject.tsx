"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { userProject } from "@/app/api/utils/interface";
import useProjects from "@/hooks/useProject";
import { useTeamStore } from "@/store/useTeamStore";
import LinkPreview from "@/components/LinkPreview";
import { useUserHackathonsStore } from "@/store/useUserHackathons";
import {
  Sparkles,
  Github,
  Globe,
  Video,
  FileText,
  Users,
  Trophy,
  Eye,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

interface createProps {
  hackathon_id: string;
  hackathon_name: string;
}

function CreateProject({ hackathon_id, hackathon_name }: createProps) {
  const router = useRouter();
  const { team } = useTeamStore();
  const { createProjectMutation } = useProjects();
  const [formData, setFormData] = useState<userProject>({
    title: "",
    description: "",
    github_url: "",
    live_link: "",
    demo_video_url: "",
    presentation_link: "",
    team: team?.id ?? 0,
    hackathon: hackathon_id ?? 0,
  });

  const hackathon = useUserHackathonsStore((state) =>
    state.hackathons.find((h) => h.id === Number(hackathon_id))
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof userProject, string>>
  >({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const isValidUrl = (url: string) => {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Partial<Record<keyof userProject, string>> = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!isValidUrl(formData.github_url))
      newErrors.github_url = "Enter a valid GitHub URL";
    if (formData.live_link && !isValidUrl(formData.live_link))
      newErrors.live_link = "Enter a valid Live link";
    if (formData.demo_video_url && !isValidUrl(formData.demo_video_url))
      newErrors.demo_video_url = "Enter a valid video URL";
    if (
      formData.presentation_link &&
      !isValidUrl(formData.presentation_link)
    )
      newErrors.presentation_link = "Enter a valid presentation link";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await createProjectMutation.mutateAsync({
        data: formData,
        hackathon_id,
      });
      setSuccessMessage("🎉 Project created successfully!");
      setFormData({
        title: "",
        description: "",
        github_url: "",
        live_link: "",
        demo_video_url: "",
        presentation_link: "",
        team: team?.id ?? 0,
        hackathon: hackathon_id ?? 0,
      });
    } catch (err: any) {
      setError(err.message || "Failed to create project.");
    }
  };

  const hasPreviewContent = formData.title && formData.description;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/10 py-8 px-4 md:px-6 lg:px-8">
      <div className="space-y-6 max-w-none">
   
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-3xl p-3 md:p-8 shadow-xl text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg md:text-3xl font-bold">Create Your Project</h1>
                <p className="text-indigo-100 text-sm">
                  Showcase your innovation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm bg-white/10 backdrop-blur-sm rounded-xl px-2 md:px-4 py-2 md:inline-flex">
              <Sparkles className="w-4 h-4" />
              <span>Hackathon: {hackathon?.title}</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <Users className="w-4 h-4" />
              <span>Team: {team?.name}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-whiterounded-3xl shadow-xl p-3 md:p-8 border border-gray-100 dark:border-gray-700 w-full"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-title">
                <FileText className="w-4 h-4 text-indigo-500" />
                Project Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter an awesome project name..."
                className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors bg-base text-base"
              />
              <AnimatePresence>
                {errors.title && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-red-500 text-sm flex items-center gap-1"
                  >
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 font-semibold text-title">
                <FileText className="w-4 h-4 text-indigo-500" />
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project, its features, and what makes it unique..."
                className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 h-[200px] resize-none outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors bg-base text-base"
              />
              <div className="flex justify-between items-center">
                <AnimatePresence>
                  {errors.description && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-red-500 text-sm flex items-center gap-1"
                    >
                      <AlertCircle className="w-4 h-4" />
                      {errors.description}
                    </motion.p>
                  )}
                </AnimatePresence>
                <span className="text-sm  opacity-50">
                  {formData.description.length} characters
                </span>
              </div>
            </div>

            {/* Project Links Section */}
            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-title mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-indigo-500" />
                Project Links
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* GitHub URL */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-base opacity-80">
                    <Github className="w-4 h-4" />
                    GitHub Repository *
                  </label>
                  <input
                    type="url"
                    name="github_url"
                    value={formData.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/username/repo"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors bg-base text-base"
                  />
                  <AnimatePresence>
                    {errors.github_url && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.github_url}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Live Link */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-base opacity-80">
                    <Globe className="w-4 h-4" />
                    Live Demo
                  </label>
                  <input
                    type="url"
                    name="live_link"
                    value={formData.live_link}
                    onChange={handleChange}
                    placeholder="https://yourproject.com"
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors bg-base text-base"
                  />
                  <AnimatePresence>
                    {errors.live_link && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.live_link}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Demo Video */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-base opacity-80">
                    <Video className="w-4 h-4" />
                    Demo Video
                  </label>
                  <input
                    type="url"
                    name="demo_video_url"
                    value={formData.demo_video_url}
                    onChange={handleChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors bg-base text-base"
                  />
                  <AnimatePresence>
                    {errors.demo_video_url && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.demo_video_url}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Presentation */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 font-medium text-base opacity-80">
                    <FileText className="w-4 h-4" />
                    Presentation
                  </label>
                  <input
                    type="url"
                    name="presentation_link"
                    value={formData.presentation_link}
                    onChange={handleChange}
                    placeholder="https://slides.com/..."
                    className="w-full border-2 border-gray-200 dark:border-gray-600 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 transition-colors bg-base text-base"
                  />
                  <AnimatePresence>
                    {errors.presentation_link && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.presentation_link}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              {hasPreviewContent && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center cursor-pointer justify-center gap-2 px-6 py-3 border-2 border-indigo-500 text-indigo-500 rounded-xl font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                >
                  <Eye className="w-5 h-5" />
                  {showPreview ? "Hide Preview" : "Show Preview"}
                </motion.button>
              )}
              <motion.button
                type="submit"
                disabled={createProjectMutation.isPending}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 flex cursor-pointer items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {createProjectMutation.isPending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Create Project
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Preview Section */}
        <AnimatePresence>
          {showPreview && hasPreviewContent && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-2 md:p-8 shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="flex items-center gap-2 mb-6">
                <Eye className="w-5 h-5 text-indigo-500" />
                <h2 className="text-2xl font-bold text-title">Preview</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-semibold  opacity-60 mb-2">
                    Project Title
                  </p>
                  <p className="text-xl font-bold text-title">
                    {formData.title}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold  opacity-60 mb-2">
                    Description
                  </p>
                  <p className=" opacity-80 leading-relaxed">
                    {formData.description}
                  </p>
                </div>

                {formData.demo_video_url && (
                  <div>
                    <p className="text-sm font-semibold  opacity-60 mb-3">
                      Demo Video
                    </p>
                    <LinkPreview
                      url={formData.demo_video_url}
                      width="100%"
                      descriptionLength={80}
                      className="rounded-xl shadow-lg"
                    />
                  </div>
                )}

                {(formData.github_url ||
                  formData.live_link ||
                  formData.presentation_link) && (
                  <div>
                    <p className="text-sm font-semibold  opacity-60 mb-3">
                      Project Links
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      {formData.github_url && (
                        <LinkPreview
                          url={formData.github_url}
                          width="100%"
                          descriptionLength={60}
                          className="rounded-xl shadow-lg"
                        />
                      )}
                      {formData.live_link && (
                        <LinkPreview
                          url={formData.live_link}
                          width="100%"
                          descriptionLength={60}
                          className="rounded-xl shadow-lg"
                        />
                      )}
                      {formData.presentation_link && (
                        <LinkPreview
                          url={formData.presentation_link}
                          width="100%"
                          descriptionLength={60}
                          className="rounded-xl shadow-lg"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSuccessMessage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center max-w-md w-full"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <h2 className="text-2xl font-bold text-title mb-2">Success!</h2>
              <p className="text-base opacity-70 mb-6">{successMessage}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSuccessMessage(null);
                  window.location.reload();
                }}
                className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all w-full"
              >
                Done
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CreateProject;

