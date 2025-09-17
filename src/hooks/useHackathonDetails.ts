import { useState, useEffect } from "react";

interface Project {
  id: number;
  name: string;
  description: string;
  github_url: string;
  live_link: string;
  presentation_url: string;
  title: string;
}

interface Team {
  id: number;
  name: string;
  members: any[];
}

export interface Submission {
  id: number;
  project: Project;
  team: Team;
  hackathon: number;
  approved: boolean;
  created_at: string;
  updated_at: string;
  status: string;
}

export interface Hackathon {
  project: Project;
  hackathon: number;
  // team: any;
  // status: any;
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  submission_deadline: string;
  banner_image: string;
  grand_prize: number;
  max_team_size: number;
  min_team_size: number;
  organization: number;
  participants: any[];
  judges: number[];
  skills: number[];
  themes: any[];
  prizes: string;
  rules: string;
  details: any;
  submissions: Submission[];
  created_at: string;
  updated_at: string;
  venue: string;
}

interface UseHackathonOptions {
  enabled?: boolean;
}

interface UseHackathonReturn {
  hackathons: Submission[];
  selectedHackathon: Submission | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  selectHackathon: (index: number) => void;
}

export const useHackathon = (
  hackathonID: string | null,
  options: UseHackathonOptions = {}
): UseHackathonReturn => {
  const { enabled = true } = options;
  const [hackathons, setHackathons] = useState<Submission[]>([]);
  const [selectedHackathon, setSelectedHackathon] = useState<Submission | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const bearerToken = localStorage.getItem("access_token");
      if (!bearerToken) {
        setError("No access token found. Please log in again.");
        return;
      }

      const response = await fetch(
        // `${process.env.NEXT_PUBLIC_API_URL}/hackathon/judge/hackathons/`,
        `${process.env.NEXT_PUBLIC_API_URL}/hackathon/${hackathonID}/submissions/`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${bearerToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        setError("Session expired. Please log in again.");
        return;
      }

      if (response.status === 403) {
        setError("Access denied. Judge role required.");
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.error ||
            `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("Hackathon judged by a judge", data);

      // Since the API returns an array of hackathons
      setHackathons(data);

      // Automatically select the first hackathon if available
      if (data.length > 0) {
        setSelectedHackathon(data[0]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching hackathons";
      setError(errorMessage);
      console.error("Error fetching hackathons:", err);
    } finally {
      setLoading(false);
    }
  };

  const selectHackathon = (index: number) => {
    if (hackathons[index]) {
      setSelectedHackathon(hackathons[index]);
    }
  };

  useEffect(() => {
    if (enabled) {
      fetchData();
    }
  }, [enabled]);

  return {
    hackathons,
    selectedHackathon,
    loading,
    error,
    refetch: fetchData,
    selectHackathon,
  };
};
