import { Review } from "@/hooks/useHackathonDetails";
import { useState, useEffect } from "react";

interface EvaluationItem {
  section: string;
  description: string;
  grade: number;
}

interface JudgeEvaluation {
  judgeId: string;
  judgeName: string;
  judgeAvatar: string;
  status: "completed" | "in-progress" | "not-started";
  submittedAt?: string;
  evaluations: EvaluationItem[];
  comments: string;
  totalScore: number;
  averageScore: number;
}

interface review {
  reviews: Review[];
}

function OtherJudges({ reviews }: review) {
  console.log("Here are the reviews:", reviews);

  const [selectedJudge, setSelectedJudge] = useState<string | null>(null);
  const [filteredJudges, setFilteredJudges] = useState<JudgeEvaluation[]>([]);

  useEffect(() => {
    const currentUser = JSON.parse(
      localStorage.getItem("user-storage") || "{}"
    );
    const currentJudgeId = currentUser.state.user.id;

    // Filter out current judge's review and transform data
    const otherJudgesReviews = reviews.filter(
      (review) => review.judge.id !== currentJudgeId
    );

    const transformedJudges: JudgeEvaluation[] = otherJudgesReviews.map(
      (review) => {
        const evaluations: EvaluationItem[] = [
          {
            section: "Innovation",
            description: "",
            grade: review.innovation_score,
          },
          {
            section: "Technical Complexity",
            description: "",
            grade: review.technical_score,
          },
          {
            section: "User Experience",
            description: "",
            grade: review.user_experience_score,
          },
          { section: "Impact", description: "", grade: review.impact_score },
          {
            section: "Presentation",
            description: "",
            grade: review.presentation_score,
          },
        ];

        const totalScore =
          review.innovation_score +
          review.technical_score +
          review.user_experience_score +
          review.impact_score +
          review.presentation_score;
        const averageScore = totalScore / 5;

        // Generate initials from username or use first two letters
        const generateInitials = (username: string): string => {
          if (!username) return "??";
          const words = username.split(/[\s_-]+/);
          if (words.length >= 2) {
            return words
              .slice(0, 2)
              .map((word) => word.charAt(0).toUpperCase())
              .join("");
          }
          return username.slice(0, 2).toUpperCase();
        };

        // Determine status based on whether scores exist and review is complete
        const hasAllScores =
          review.innovation_score > 0 &&
          review.technical_score > 0 &&
          review.user_experience_score > 0 &&
          review.impact_score > 0 &&
          review.presentation_score > 0;

        let status: "completed" | "in-progress" | "not-started";
        if (hasAllScores && review.overall_score > 0) {
          status = "completed";
        } else if (hasAllScores || review.overall_score > 0) {
          status = "in-progress";
        } else {
          status = "not-started";
        }

        return {
          judgeId: review.judge.id.toString(),
          judgeName: review.judge.username,
          judgeAvatar: generateInitials(review.judge.username),
          status,
          submittedAt:
            status === "completed"
              ? new Date().toISOString().slice(0, 16).replace("T", " ")
              : undefined,
          evaluations,
          comments: review.review || "",
          totalScore,
          averageScore: Math.round(averageScore * 10) / 10,
        };
      }
    );

    setFilteredJudges(transformedJudges);
  }, [reviews]);

  const completedJudges = filteredJudges.filter(
    (judge) => judge.status === "completed"
  );
  const inProgressJudges = filteredJudges.filter(
    (judge) => judge.status === "in-progress"
  );
  const notStartedJudges = filteredJudges.filter(
    (judge) => judge.status === "not-started"
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "not-started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "not-started":
        return "Not Started";
      default:
        return status;
    }
  };

  const getGradeColor = (grade: number) => {
    if (grade >= 8) return "text-green-600";
    if (grade >= 6) return "text-yellow-600";
    if (grade >= 4) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Other Judges' Evaluations
          </h2>
          <p className="text-gray-600 mt-1">
            Compare evaluations from other judges for this submission
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-green-600">
                {completedJudges.length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-yellow-600">
                {inProgressJudges.length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-600">
                {notStartedJudges.length}
              </div>
              <div className="text-sm text-gray-600">Not Started</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-[#605DEC]">
                {completedJudges.length > 0
                  ? (
                      completedJudges.reduce(
                        (sum, judge) => sum + judge.averageScore,
                        0
                      ) / completedJudges.length
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-sm text-gray-600">Avg Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Judges List */}
      <div className="space-y-4">
        {filteredJudges.map((judge) => (
          <div
            key={judge.judgeId}
            className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            <div
              className="p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-200"
              onClick={() =>
                setSelectedJudge(
                  selectedJudge === judge.judgeId ? null : judge.judgeId
                )
              }
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-[#605DEC] rounded-full flex items-center justify-center text-white font-medium text-lg">
                    {judge.judgeAvatar}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {judge.judgeName}
                    </h3>
                    {judge.submittedAt && (
                      <p className="text-sm text-gray-500">
                        Submitted:{" "}
                        {new Date(judge.submittedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {judge.status === "completed" && (
                    <div className="text-right">
                      <div className="font-bold text-[#605DEC] text-xl">
                        {judge.totalScore}/50
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: {judge.averageScore}/10
                      </div>
                    </div>
                  )}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      judge.status
                    )}`}
                  >
                    {getStatusText(judge.status)}
                  </span>
                  <svg
                    className={`w-6 h-6 text-gray-400 transition-transform duration-200 ${
                      selectedJudge === judge.judgeId ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Expanded Content */}
            {selectedJudge === judge.judgeId &&
              judge.status === "completed" && (
                <div className="border-t border-gray-200 bg-gray-50">
                  <div className="p-6 space-y-6">
                    {/* Evaluation Breakdown */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-4 text-lg">
                        Evaluation Breakdown
                      </h4>
                      <div className="grid gap-4">
                        {judge.evaluations.map((evaluation, index) => (
                          <div
                            key={index}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-gray-900">
                                {evaluation.section}
                              </div>
                              <div
                                className={`font-bold text-lg ${getGradeColor(
                                  evaluation.grade
                                )}`}
                              >
                                {evaluation.grade}/10
                              </div>
                            </div>
                            <div className="relative h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#605DEC] to-[#7C3AED] rounded-full transition-all duration-500"
                                style={{ width: `${evaluation.grade * 10}%` }}
                              />
                            </div>
                            <div className="mt-2 text-xs text-gray-500">
                              {evaluation.grade >= 8
                                ? "Excellent"
                                : evaluation.grade >= 6
                                ? "Good"
                                : evaluation.grade >= 4
                                ? "Fair"
                                : "Needs Improvement"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Comments */}
                    {judge.comments && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 text-lg">
                          Judge's Comments
                        </h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 leading-relaxed">
                          {judge.comments}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

            {/* In Progress or Not Started States */}
            {selectedJudge === judge.judgeId &&
              judge.status !== "completed" && (
                <div className="border-t border-gray-200 bg-gray-50 p-6 text-center">
                  <div className="text-gray-500">
                    {judge.status === "in-progress" ? (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="animate-spin w-5 h-5 text-yellow-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        <span>
                          This judge is currently working on their evaluation
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span>
                          This judge has not started their evaluation yet
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredJudges.length === 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Other Judges Assigned
          </h3>
          <p className="text-gray-500">
            There are currently no other judges assigned to evaluate this
            submission.
          </p>
        </div>
      )}
    </div>
  );
}

export default OtherJudges;
