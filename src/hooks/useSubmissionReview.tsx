import { useEffect, useState } from "react";
import { Hackathon, Submission } from "./useHackathonDetails";

export const useSubmissionReview = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hackathonDetails, sethackathonDetails] = useState<Hackathon | null>(
    null
  );
  const [currentSubmission, setcurrentSubmission] = useState<Submission | null>(
    null
  );

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
      setcurrentSubmission(submissionData.submissions[0] || null);
      sethackathonDetails(submissionData || null);
      console.log("Hackathon data:", submissionData.submissions);
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
        `${process.env.NEXT_PUBLIC_API_URL}/team/teams/${teamId}/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const teamData = await submissionResponse.json();
      console.log("Team data:", teamData);
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
  async function review(hackathonId: string) {
    try {
      setLoading(true);

      const submissionResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${hackathonId}/reviews/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const teamData = await submissionResponse.json();
      console.log("your previous reviews", teamData);
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
    hackathon(id);
    team("2");
    review("22")
  }, [id]);

  return {
    loading,
    error,
    hackathonDetails,
    currentSubmission,
  };
};
