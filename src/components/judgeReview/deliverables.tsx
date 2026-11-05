import React from "react";
import { Submission } from "@/hooks/useHackathonDetails";
import { ExternalLink, Github, Globe, Video, Presentation } from "lucide-react";

function Deliverables({ items }: { items: Submission }) {
  const project = items?.project as any;

  // Extract all 4 deliverables, supporting aliases and deliverables object
  const githubUrl =
    project?.github_url ||
    project?.deliverables?.github_url ||
    project?.github_link ||
    project?.github ||
    project?.repo_url ||
    project?.repository_url ||
    "";

  const liveLink =
    project?.live_link ||
    project?.deliverables?.live_link ||
    project?.live_url ||
    project?.demo_link ||
    project?.deployment_url ||
    project?.website_url ||
    "";

  const demoVideoUrl =
    project?.demo_video_url ||
    project?.deliverables?.demo_video_url ||
    project?.video_url ||
    project?.deliverables?.video_url ||
    project?.video_link ||
    project?.demo_url ||
    project?.youtube_url ||
    project?.video ||
    "";

  const presentationLink =
    project?.presentation_link ||
    project?.deliverables?.presentation_link ||
    project?.presentation_url ||
    project?.deliverables?.presentation_url ||
    project?.slides_url ||
    project?.slides_link ||
    project?.pitch_deck ||
    project?.pitch_deck_url ||
    "";

  const deliverablesList = [
    {
      id: "github",
      label: "GitHub Repository",
      url: githubUrl,
      icon: <Github className="w-5 h-5 text-gray-800 dark:text-gray-200" />,
      badge: "Source Code",
      badgeColor: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600",
    },
    {
      id: "live",
      label: "Live Demo / Deployment",
      url: liveLink,
      icon: <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
      badge: "Live App",
      badgeColor: "bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    },
    {
      id: "video",
      label: "Demo Video",
      url: demoVideoUrl,
      icon: <Video className="w-5 h-5 text-red-600 dark:text-red-400" />,
      badge: "Video Walkthrough",
      badgeColor: "bg-red-50 dark:bg-red-900/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    },
    {
      id: "presentation",
      label: "Presentation / Pitch Deck",
      url: presentationLink,
      icon: <Presentation className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
      badge: "Pitch Slides",
      badgeColor: "bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    },
  ];

  const hasAnyDeliverables = deliverablesList.some((d) => Boolean(d.url));

  return (
    <div className="space-y-4 md:w-[850px] max-w-full">
      <div className="mb-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Project Deliverables
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Review the submitted links, source repository, demonstration video, and presentation materials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {deliverablesList.map((item) => {
          if (!item.url) {
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 opacity-50">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 dark:text-gray-400">
                      {item.label}
                    </h4>
                    <span className="text-xs text-gray-400 dark:text-gray-500">
                      Not provided for this project
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-xs hover:shadow-sm transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/60 border border-gray-100 dark:border-gray-600 shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-sm text-gray-900 dark:text-white">
                        {item.label}
                      </h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    </div>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline break-all block mt-0.5"
                    >
                      {item.url}
                    </a>
                  </div>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-white dark:hover:text-white bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-600 dark:hover:bg-indigo-600 border border-indigo-200 dark:border-indigo-800 rounded-lg transition-colors shrink-0"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {!hasAnyDeliverables && (
        <div className="text-gray-500 italic p-6 text-center border dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          No deliverables provided for this project.
        </div>
      )}
    </div>
  );
}

export default Deliverables;
