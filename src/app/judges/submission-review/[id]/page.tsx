"use client";

import { useParams } from "next/navigation";
import { useSubmissionReview } from "@/hooks/useSubmissionReview";
import Tabscontent from "@/components/Tabscontent";
import JudgeError from "@/components/judgeReview/JudgeError";
import { useHackathon } from "@/hooks/useHackathonDetails";

export default function SubmissionReviewPage() {
  const params = useParams();
  const submissionId = params.id as string;

  // const { hackathonDetails, loading, error, currentSubmission } =
  //   useSubmissionReview(submissionId);

  const { hackathons, loading, error, selectedHackathon } =
    useHackathon(submissionId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#605DEC] dark:border-indigo-400"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading submission details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <JudgeError error={error} />;
  }

  // if (!currentSubmission || !hackathonDetails) {
  if (!selectedHackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <p className="text-gray-600">No submission found.</p> */}
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:max-w-8xl sm:max-w-full max-w-96 bg-gray-50 dark:bg-gray-900 p-6 transition-colors">
      <div className=" mx-auto">
        <h1 className="text-2xl mb-2 font-semibold text-[#605DEC] dark:text-indigo-400">
          Submission Review
        </h1>
        <p className="dark:text-gray-300">
          Reviewing submissions for <span className="font-bold md:text-2xl text-xl italic">{selectedHackathon?.project?.title}</span>
        </p>
      </div>

      <div className=" max-w-full overflow-x-auto my-5 shadow-md rounded-md border border-[#E4E4E4] dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors scrollbar-hide">
        <div className="lg:w-[1114px] max overflow-x-scroll px-3 py-8 scrollbar-hide">
          {
            <Tabscontent
              submission={selectedHackathon}
              hackathonId={selectedHackathon?.hackathon?.toString() ?? ""}
            />
            // <Tabscontent
            //   submission={currentSubmission}
            //   hackathonId={hackathonDetails?.id.toString()}
            // />
          }
        </div>
      </div>
    </div>
  );
}
