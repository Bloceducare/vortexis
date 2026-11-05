"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/api";

export interface ReviewData {
  submission: number;
  innovation_score: number;
  technical_score: number;
  user_experience_score: number;
  impact_score: number;
  presentation_score: number;
  overall_score: number;
  review?: string;
}

export interface ReviewResponse {
  id: number;
  submission: number;
  judge: string | any;
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
    hackathonId: string | number,
    reviewData: ReviewData
  ) => Promise<ReviewResponse | null>;
  updateReview: (
    hackathonId: string | number,
    reviewId: number,
    reviewData: ReviewData
  ) => Promise<ReviewResponse | null>;
  isSubmitting: boolean;
  error: string | null;
}

export function useReviewSubmission(): UseReviewSubmissionReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const submitReview = async (
    hackathonId: string | number,
    reviewData: ReviewData
  ): Promise<ReviewResponse | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      // 1. Attempt POST to submit a new review
      const res = await api.post(`/hackathon/${hackathonId}/reviews/`, reviewData);
      const result: ReviewResponse = res.data;

      toast.success(
        "Review submitted successfully! Your evaluation has been saved.",
        { autoClose: 3000 }
      );

      setTimeout(() => {
        router.push("/judges");
      }, 1500);

      return result;
    } catch (err: any) {
      const status = err?.response?.status;
      const errorData = err?.response?.data;
      const errorMsg =
        errorData?.non_field_errors?.[0] ||
        errorData?.detail ||
        errorData?.message ||
        errorData?.error ||
        err?.message ||
        "";

      // If review already exists, attempt to update it automatically
      const isAlreadyReviewed =
        status === 400 &&
        (typeof errorMsg === "string" &&
          (errorMsg.toLowerCase().includes("already") ||
            errorMsg.toLowerCase().includes("reviewed") ||
            errorMsg.toLowerCase().includes("exist")));

      if (isAlreadyReviewed) {
        try {
          // Fetch existing reviews to locate the review ID
          const existingRes = await api.get(
            `/hackathon/${hackathonId}/reviews/?submission=${reviewData.submission}`
          );
          const data = existingRes.data;
          const reviewsList = Array.isArray(data)
            ? data
            : Array.isArray(data?.reviews)
            ? data.reviews
            : Array.isArray(data?.results)
            ? data.results
            : [];

          const existing =
            reviewsList.find(
              (r: any) => Number(r.submission) === Number(reviewData.submission)
            ) || reviewsList[0];

          if (existing?.id) {
            return await updateReview(hackathonId, existing.id, reviewData);
          }
        } catch (fetchErr) {
          console.warn("Could not auto-fetch existing review for update:", fetchErr);
        }
      }

      const finalErrorMessage =
        errorMsg || "Failed to submit review. Please try again.";
      setError(finalErrorMessage);
      toast.error(`Submission failed: ${finalErrorMessage}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateReview = async (
    hackathonId: string | number,
    reviewId: number,
    reviewData: ReviewData
  ): Promise<ReviewResponse | null> => {
    setIsSubmitting(true);
    setError(null);

    try {
      let res;
      try {
        res = await api.patch(
          `/hackathon/${hackathonId}/reviews/${reviewId}/`,
          reviewData
        );
      } catch (patchErr: any) {
        // If PATCH fails with 405 or method not allowed, try PUT
        if (patchErr?.response?.status === 405) {
          res = await api.put(
            `/hackathon/${hackathonId}/reviews/${reviewId}/`,
            reviewData
          );
        } else {
          throw patchErr;
        }
      }

      const result: ReviewResponse = res.data;

      toast.success(
        "Review updated successfully! Your evaluation has been saved.",
        { autoClose: 3000 }
      );

      setTimeout(() => {
        router.push("/judges");
      }, 1500);

      return result;
    } catch (err: any) {
      const errorData = err?.response?.data;
      const errorMessage =
        errorData?.non_field_errors?.[0] ||
        errorData?.detail ||
        errorData?.message ||
        err?.message ||
        "Failed to update review";
      setError(errorMessage);
      toast.error(`Update failed: ${errorMessage}`);
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitReview,
    updateReview,
    isSubmitting,
    error,
  };
}
