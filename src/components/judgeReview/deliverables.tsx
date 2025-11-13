import { Submission } from "@/hooks/useHackathonDetails";

function Deliverables({ items }: { items: Submission }) {
  return (
    <div className="space-y-6 md:w-[850px]">
      <p className="w-full p-1.75 text-[#8F9098] dark:text-gray-300 rounded-lg border border-[#C5C6CC] dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors">
        <span className="font-bold mr-2">GitHub URL:</span>{" "}
        <a href={items?.project?.github_url} className="text-blue-400 dark:text-blue-400">
          {items?.project?.github_url}
        </a>
      </p>{" "}
      <p className="w-full p-1.75 text-[#8F9098] dark:text-gray-300 rounded-lg border border-[#C5C6CC] dark:border-gray-600 bg-white dark:bg-gray-800 transition-colors">
        <span className="font-bold mr-2">Live Link:</span>{" "}
        <a href={items?.project?.live_link} className="text-blue-400 dark:text-blue-400">
          {items?.project?.live_link}
        </a>
      </p>{" "}
      {/* <a className="w-full p-1.75 text-[#8F9098] rounded-lg border border-[#C5C6CC]">
        {items?.presentationSlidesUrl}
      </a> */}
    </div>
  );
}

export default Deliverables;
