import { useState, useEffect } from "react";
import api from "@/lib/api";

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

      const response = await api.get("/hackathon/judge/hackathons");
      setHackathons(response.data);
    } catch (err: any) {
      if (err.response?.status === 403) {
        setUnauthorized(true);
      }
      setError(err instanceof Error ? err.message : err.response?.data?.detail || "An error occurred");
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
