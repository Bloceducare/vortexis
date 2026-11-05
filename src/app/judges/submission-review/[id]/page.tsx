"use client";

import { useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import Tabscontent from "@/components/Tabscontent";
import JudgeError from "@/components/judgeReview/JudgeError";
import { useHackathon } from "@/hooks/useHackathonDetails";
import { ChevronDown, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function SubmissionReviewPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const hackathonRouteId = params.id as string;
  const targetSubmissionQuery = searchParams.get("submission");

  const {
    hackathons,
    loading,
    error,
    selectedHackathon,
    selectHackathon,
    selectSubmissionById,
  } = useHackathon(hackathonRouteId);

  // Automatically select the targeted submission if passed in query param
  useEffect(() => {
    if (targetSubmissionQuery && hackathons.length > 0) {
      if (!selectedHackathon || String(selectedHackathon.id) !== String(targetSubmissionQuery)) {
        selectSubmissionById(targetSubmissionQuery);
      }
    }
  }, [targetSubmissionQuery, hackathons, selectedHackathon, selectSubmissionById]);

  const handleSelectSubmission = (index: number) => {
    selectHackathon(index);
    const sub = hackathons[index];
    if (sub) {
      const currentTab = searchParams.get("tab") || "4";
      router.replace(`?submission=${sub.id}&tab=${currentTab}`, { scroll: false });
    }
  };

  const currentIndex = selectedHackathon
    ? hackathons.findIndex((s) => s.id === selectedHackathon.id)
    : -1;
  const prevSubmission = currentIndex > 0 ? hackathons[currentIndex - 1] : null;
  const nextSubmission =
    currentIndex !== -1 && currentIndex < hackathons.length - 1
      ? hackathons[currentIndex + 1]
      : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors">
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

  if (!selectedHackathon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">No submissions found to review.</p>
          <Link
            href="/judges"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            Back to Judge Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const currentHackathonId = String(
    selectedHackathon?.hackathon || hackathonRouteId || ""
  );

  return (
    <div className="min-h-screen lg:max-w-8xl sm:max-w-full max-w-96 bg-gray-50 dark:bg-gray-900 p-4 md:p-6 transition-colors">
      <div className="mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <Link
            href={`/judges/dashboard/${currentHackathonId}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Submissions List
          </Link>
          <h1 className="text-2xl font-bold text-[#605DEC] dark:text-indigo-400">
            Submission Review
          </h1>
          <p className="text-sm dark:text-gray-300">
            Evaluating project:{" "}
            <span className="font-bold text-base md:text-lg text-gray-900 dark:text-white">
              {selectedHackathon?.project?.title}
            </span>{" "}
            <span className="text-xs text-gray-500">
              (Submission #{selectedHackathon.id})
            </span>
          </p>
        </div>

        {/* Multi-submission switcher if hackathon has multiple submissions */}
        {hackathons.length > 1 && (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => prevSubmission && handleSelectSubmission(currentIndex - 1)}
              disabled={!prevSubmission}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              ← Prev
            </button>
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">
                Project:
              </label>
              <select
                value={currentIndex}
                onChange={(e) => handleSelectSubmission(Number(e.target.value))}
                className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-xs rounded-lg px-3 py-2 text-gray-800 dark:text-gray-200 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {hackathons.map((sub, index) => (
                  <option key={sub.id} value={index}>
                    #{sub.id} - {sub.project?.title || `Submission ${sub.id}`} ({sub.team?.name || "Team"})
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => nextSubmission && handleSelectSubmission(currentIndex + 1)}
              disabled={!nextSubmission}
              className="px-2.5 py-1.5 text-xs font-medium rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <div className="max-w-full overflow-x-auto my-5 shadow-md rounded-md border border-[#E4E4E4] dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors scrollbar-hide">
        <div className="lg:w-[1114px] max overflow-x-scroll px-3 py-8 scrollbar-hide">
          <Tabscontent
            key={selectedHackathon.id}
            submission={selectedHackathon}
            hackathonId={currentHackathonId}
          />
        </div>
      </div>
    </div>
  );
}
