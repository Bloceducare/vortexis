import { useState, useEffect } from "react";

interface HackathonJudged {
  id: string;
  title: string;
  description: string;
  end_date: string;
  status?: string;
  // reviews_completed: string;
}

interface UseJudgedHackathonsReturn {
  hackathons: HackathonJudged[];
  loading: boolean;
  error: string | null;
  unauthorized: boolean;
}

export const useJudgedHackathons = (): UseJudgedHackathonsReturn => {
  const [hackathons, setHackathons] = useState<HackathonJudged[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [unauthorized, setUnauthorized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const bearerToken = localStorage.getItem("access_token");
      if (!bearerToken) {
        setError("No access token found");
        return;
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/hackathon/judge/hackathons`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
          },
        }
      );

      if (response.status === 403) {
        console.log("User is not authorized");
        setUnauthorized(true);
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setHackathons(data);
      console.log(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching hackathons:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return {
    hackathons,
    loading,
    error,
    unauthorized,
  };
};
