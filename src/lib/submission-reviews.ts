"use client";

import { useState } from "react";
import { toast } from "react-toastify";

interface ReviewData {
  submission: number;
  innovation_score: number;
  technical_score: number;
  user_experience_score: number;
  impact_score: number;
  presentation_score: number;
  overall_score: number;
  review?: string;
}

interface ReviewResponse {
  id: number;
  submission: number;
  judge: string;
  innovation_score: number;
  technical_score: number;
  user_experience_score: number;
  impact_score: number;
  presentation_score: number;
  overall_score: number;
  review?: string;
  created_at: string;
  updated_at: string;
}

interface UseReviewSubmissionReturn {
  submitReview: (
    hackathonId: string,
    reviewData: ReviewData
  ) => Promise<ReviewResponse | null>;
  isSubmitting: boolean;
  error: string | null;
}

export function useReviewSubmission(): UseReviewSubmissionReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = async (
    hackathonId: string,
    reviewData: ReviewData
  ): Promise<ReviewResponse | null> => {
    setIsSubmitting(true);
    setError(null);

    const bearerToken = localStorage.getItem("access_token");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${hackathonId}/reviews/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reviewData),
        }
      );

      if (response.status === 400) {
        setError("Reviewed has been made");
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      const result: ReviewResponse = await response.json();

      toast.success(
        "Review submitted successfully! Your evaluation has been saved."
      );

      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to submit review";
      setError(errorMessage);

      toast.error(`Submission failed: ${errorMessage}`);

      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReview,
    isSubmitting,
    error,
  };
}
