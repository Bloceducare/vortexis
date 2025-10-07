"use client";

import { useSubmissionReview } from "@/hooks/useSubmissionReview";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";

interface ApiReview {
  id: number;
  created_at: string;
  updated_at: string;
  impact_score: number;
  innovation_score: number;
  overall_score: number;
  presentation_score: number;
  technical_score: number;
  user_experience_score: number;
  review: string;
  submission: number;
  hackathon_id: number; // Added hackathon_id field
}

interface SubmissionDetails {
  id: number;
  project: {
    id: number;
    title: string;
  };
}

interface HackathonDetails {
  id: number;
  title: string;
}

interface ReviewSummary {
  id: string;
  submissionId: string;
  submissionName: string;
  hackathonName: string;
  dateReviewed: string;
  totalScore: number;
  maxTotalScore: number;
  comments: string;
  scores: {
    criterion: string;
    score: number;
    maxScore: number;
  }[];
}

// Function to fetch submission details
async function fetchSubmissionDetails(
  hackathonId: number,
  submissionId: number
): Promise<string> {
  try {
    const bearerToken = localStorage.getItem("access_token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${hackathonId}/submissions/${submissionId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch submission details: ${response.status}`);
    }

    const data: SubmissionDetails = await response.json();
    return data.project.title;
  } catch (error) {
    console.error("Error fetching submission details:", error);
    return `Submission #${submissionId}`;
  }
}

// Function to fetch hackathon details
async function fetchHackathonDetails(hackathonId: number): Promise<string> {
  try {
    const bearerToken = localStorage.getItem("access_token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${hackathonId}/`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${bearerToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch hackathon details: ${response.status}`);
    }

    const data: HackathonDetails = await response.json();
    return data.title;
  } catch (error) {
    console.error("Error fetching hackathon details:", error);
    return "Unknown Hackathon";
  }
}

// Updated transformation function
async function transformApiReviewToSummary(
  apiReview: ApiReview
): Promise<ReviewSummary> {
  const totalScore =
    apiReview.impact_score +
    apiReview.innovation_score +
    apiReview.presentation_score +
    apiReview.technical_score +
    apiReview.user_experience_score;

  // Fetch submission and hackathon names
  const [submissionName, hackathonName] = await Promise.all([
    fetchSubmissionDetails(apiReview.hackathon_id, apiReview.submission),
    fetchHackathonDetails(apiReview.hackathon_id),
  ]);

  return {
    id: apiReview.id.toString(),
    submissionId: apiReview.submission.toString(),
    submissionName: submissionName,
    hackathonName: hackathonName,
    dateReviewed: apiReview.created_at,
    totalScore: totalScore,
    maxTotalScore: 50,
    comments: apiReview.review,
    scores: [
      {
        criterion: "Innovation",
        score: apiReview.innovation_score,
        maxScore: 10,
      },
      {
        criterion: "Technical Complexity",
        score: apiReview.technical_score,
        maxScore: 10,
      },
      {
        criterion: "User Experience",
        score: apiReview.user_experience_score,
        maxScore: 10,
      },
      { criterion: "Impact", score: apiReview.impact_score, maxScore: 10 },
      {
        criterion: "Presentation",
        score: apiReview.presentation_score,
        maxScore: 10,
      },
    ],
  };
}

function ReviewCard({ review }: { review: ReviewSummary }) {
  const formattedDate = new Date(review.dateReviewed).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const scorePercentage = Math.round(
    (review.totalScore / review.maxTotalScore) * 100
  );

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">
          {review.submissionName}
        </h3>
        <span className="text-sm text-gray-500">{formattedDate}</span>
      </div>
      <p className="text-gray-600 text-sm">
        <span className="font-medium">Hackathon:</span> {review.hackathonName}
      </p>
      <div className="flex items-center justify-between text-sm text-gray-700">
        <span className="font-medium">Overall Score:</span>
        <span className="font-bold text-blue-600">
          {review.totalScore} / {review.maxTotalScore} ({scorePercentage}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${scorePercentage}%` }}
          role="progressbar"
          aria-valuenow={scorePercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
      <div className="mt-2">
        <p className="font-medium text-gray-700 text-sm mb-1">Breakdown:</p>
        <ul className="space-y-1.5 text-sm text-gray-600">
          {review.scores.map((s, idx) => (
            <li key={idx} className="flex justify-between">
              <span>{s.criterion}:</span>
              <span className="font-medium">
                {s.score}/{s.maxScore}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3">
        <p className="font-medium text-gray-700 text-sm mb-1">Comments:</p>
        <p className="text-gray-700 text-sm italic bg-gray-50 p-3 rounded-md border border-gray-200">
          {review.comments || "No comments provided."}
        </p>
      </div>
    </div>
  );
}

export default function MyReviewsPage() {
  const { reviewsData, loading, error } = useSubmissionReview("1");
  const [searchTerm, setSearchTerm] = useState("");
  const [myReviews, setMyReviews] = useState<ReviewSummary[]>([]);
  const [transforming, setTransforming] = useState(false);

  // Transform reviews data when it's available
  useEffect(() => {
    if (reviewsData && Array.isArray(reviewsData)) {
      setTransforming(true);

      // Transform all reviews in parallel
      Promise.all((reviewsData as ApiReview[]).map(transformApiReviewToSummary))
        .then((transformedReviews) => {
          setMyReviews(transformedReviews);
        })
        .catch((error) => {
          console.error("Error transforming reviews:", error);
          // Fallback to basic transformation if API calls fail
          const fallbackReviews = (reviewsData as ApiReview[]).map(
            (review) => ({
              id: review.id.toString(),
              submissionId: review.submission.toString(),
              submissionName: `Submission #${review.submission}`,
              hackathonName: "Unknown Hackathon",
              dateReviewed: review.created_at,
              totalScore:
                review.impact_score +
                review.innovation_score +
                review.presentation_score +
                review.technical_score +
                review.user_experience_score,
              maxTotalScore: 50,
              comments: review.review,
              scores: [
                {
                  criterion: "Innovation",
                  score: review.innovation_score,
                  maxScore: 10,
                },
                {
                  criterion: "Technical Complexity",
                  score: review.technical_score,
                  maxScore: 10,
                },
                {
                  criterion: "User Experience",
                  score: review.user_experience_score,
                  maxScore: 10,
                },
                {
                  criterion: "Impact",
                  score: review.impact_score,
                  maxScore: 10,
                },
                {
                  criterion: "Presentation",
                  score: review.presentation_score,
                  maxScore: 10,
                },
              ],
            })
          );
          setMyReviews(fallbackReviews);
        })
        .finally(() => {
          setTransforming(false);
        });
    }
  }, [reviewsData]);

  const filteredReviews = myReviews.filter(
    (review) =>
      review.submissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.hackathonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comments.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Reviews</h1>
        <p className="text-red-600 mb-6">Error loading reviews: {error}</p>
      </div>
    );
  }

  if (loading || transforming) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">My Reviews</h1>
        <p className="text-gray-600 mb-6">
          {loading ? "Loading your reviews..." : "Processing review details..."}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">My Reviews</h1>
      <p className="text-gray-600 mb-6">
        A detailed history of all your completed hackathon reviews.
      </p>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search reviews by submission, hackathon, or comments..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Search reviews"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-gray-400" />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No reviews found matching your search.
          </p>
        )}
      </div>
    </div>
  );
}
