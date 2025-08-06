"use client";

import { Search } from "lucide-react";
import { useState } from "react";

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
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600">
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
      {/* <div className="flex justify-end mt-3">
        <button className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none">
          View Full Submission
        </button>
      </div> */}
    </div>
  );
}

export default function MyReviewsPage() {
  // data/my-reviews.ts

  const myReviews: ReviewSummary[] = [
    {
      id: "rev1",
      submissionId: "sub001",
      submissionName: "Eco-Friendly AI Waste Sorter",
      hackathonName: "Future Tech Summit 2025",
      dateReviewed: "2025-05-14T18:00:00Z",
      totalScore: 42,
      maxTotalScore: 50,
      comments:
        "Strong potential, excellent use of AI for waste classification. The demo had minor glitches, and scalability for large datasets needs further consideration. Overall, a very promising project.",
      scores: [
        { criterion: "Innovation", score: 9, maxScore: 10 },
        { criterion: "Technical Complexity", score: 8, maxScore: 10 },
        { criterion: "User Experience", score: 7, maxScore: 10 },
        { criterion: "Impact", score: 9, maxScore: 10 },
        { criterion: "Presentation", score: 9, maxScore: 10 },
      ],
    },
    {
      id: "rev2",
      submissionId: "sub002",
      submissionName: "Decentralized Voting System",
      hackathonName: "Web3 Frontier Hack",
      dateReviewed: "2025-03-19T20:15:00Z",
      totalScore: 38,
      maxTotalScore: 50,
      comments:
        "Solid blockchain implementation, addressing a critical need. UI is functional but could be more intuitive. Security measures appear robust. Good effort for a hackathon project.",
      scores: [
        { criterion: "Innovation", score: 8, maxScore: 10 },
        { criterion: "Technical Complexity", score: 9, maxScore: 10 },
        { criterion: "User Experience", score: 6, maxScore: 10 },
        { criterion: "Impact", score: 8, maxScore: 10 },
        { criterion: "Presentation", score: 7, maxScore: 10 },
      ],
    },
    {
      id: "rev3",
      submissionId: "sub003",
      submissionName: "Smart Traffic Management",
      hackathonName: "Smart City Solutions",
      dateReviewed: "2025-07-23T16:30:00Z",
      totalScore: 45,
      maxTotalScore: 50,
      comments:
        "Excellent solution for urban traffic flow. The real-time data integration is impressive. Clear presentation and strong potential for real-world adoption. Minor improvements needed in edge case handling.",
      scores: [
        { criterion: "Innovation", score: 9, maxScore: 10 },
        { criterion: "Technical Complexity", score: 9, maxScore: 10 },
        { criterion: "User Experience", score: 9, maxScore: 10 },
        { criterion: "Impact", score: 9, maxScore: 10 },
        { criterion: "Presentation", score: 9, maxScore: 10 },
      ],
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const filteredReviews = myReviews.filter(
    (review) =>
      review.submissionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.hackathonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comments.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
