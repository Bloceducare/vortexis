import { Submission } from "@/hooks/useHackathonDetails";

function Deliverables({ items }: { items: Submission }) {
  const project = items?.project;

  return (
    <div className="space-y-6 md:w-[850px]">
      {project?.github_url && (
        <p className="w-full p-2.5 text-[#8F9098] dark:text-gray-300 rounded-lg border border-[#C5C6CC] dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors">
          <span className="font-bold mr-2">GitHub URL:</span>{" "}
          <a href={project.github_url} target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline break-all">
            {project.github_url}
          </a>
        </p>
      )}
      {project?.live_link && (
        <p className="w-full p-2.5 text-[#8F9098] dark:text-gray-300 rounded-lg border border-[#C5C6CC] dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors">
          <span className="font-bold mr-2">Live Link:</span>{" "}
          <a href={project.live_link} target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline break-all">
            {project.live_link}
          </a>
        </p>
      )}
      {project?.presentation_url && (
        <p className="w-full p-2.5 text-[#8F9098] dark:text-gray-300 rounded-lg border border-[#C5C6CC] dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors">
          <span className="font-bold mr-2">Presentation / Demo Video:</span>{" "}
          <a href={project.presentation_url} target="_blank" rel="noreferrer" className="text-blue-500 dark:text-blue-400 hover:underline break-all">
            {project.presentation_url}
          </a>
        </p>
      )}
      {(!project?.github_url && !project?.live_link && !project?.presentation_url) && (
        <p className="text-gray-500 italic p-4 text-center border dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          No deliverables provided for this project.
        </p>
      )}
    </div>
  );
}

export default Deliverables;
