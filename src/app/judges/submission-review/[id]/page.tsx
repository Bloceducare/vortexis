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
  console.log("my submission", hackathons);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#605DEC]"></div>
          <p className="text-gray-600">Loading submission details...</p>
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
    <div className="min-h-screen lg:max-w-7xl md:max-w-4xl bg-gray-50 p-6">
      <div className=" mx-auto">
        <h1 className="text-2xl mb-2 font-semibold text-[#605DEC]">
          Submission Review
        </h1>
        <p>Reviewing submissions for {selectedHackathon?.project?.title}</p>
      </div>

      <div className=" max-w-full overflow-x-auto my-5 shadow-md rounded-md border border-[#E4E4E4]">
        <div className="lg:w-[1114px] overflow-x-scroll px-3 py-8">
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
