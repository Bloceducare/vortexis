import { useEffect, useState } from "react";
import { Hackathon, Submission } from "./useHackathonDetails";

interface reviews {
  impact_score: number;
  innovation_score: number;
  overall_score: number;
  presentation_score: number;
  review: string;
  submission: number;
  technical_score: number;
  user_experience_score: number;
  updated_at: string;
}

export const useSubmissionReview = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hackathonDetails, sethackathonDetails] = useState<Hackathon | null>(
    null
  );
  const [currentSubmission, setcurrentSubmission] = useState<Submission | null>(
    null
  );
  const [reviewsData, setReviewsData] = useState<reviews[] | null>(null);

  const bearerToken = localStorage.getItem("access_token");
  async function hackathon(id: string) {
    try {
      setLoading(true);

      const submissionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${id}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const submissionData = await submissionResponse.json();
      // setcurrentSubmission(submissionData.submissions[0] || null);
      sethackathonDetails(submissionData || null);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching hackathons";
      setError(errorMessage);
      console.error("Error fetching hackathon data:", err);
    } finally {
      setLoading(false);
    }
  }

  async function team(teamId: string) {
    try {
      setLoading(true);

      const submissionResponse = await fetch(
        // `${process.env.NEXT_PUBLIC_API_URL}/team/teams/${teamId}/`,
        // `${process.env.NEXT_PUBLIC_API_URL}/project/hackathons/${teamId}/projects/2/`,
        `${process.env.NEXT_PUBLIC_API_URL}/project/projects/${teamId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const teamData = await submissionResponse.json();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching hackathons";
      setError(errorMessage);
      console.error("Error fetching hackathon data:", err);
    } finally {
      setLoading(false);
    }
  }
  async function review() {
    try {
      setLoading(true);

      const submissionResponse = await fetch(
        // `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${hackathonId}/reviews/`,
        `${process.env.NEXT_PUBLIC_API_URL}/hackathon/judge/reviews/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const teamData = await submissionResponse.json();
      setReviewsData(teamData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching hackathons";
      setError(errorMessage);
      console.error("Error fetching hackathon data:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      hackathon(id);
      // Fetch reviews data as it's needed for the my-reviews page
      review();
    }
    // Don't fetch team data with hardcoded ID
    // team("2");
  }, [id]);

  return {
    loading,
    error,
    hackathonDetails,
    currentSubmission,
    reviewsData,
  };
};
