import { useState, useEffect } from "react";

interface Hackathon {
  id: string;
  title: string;
  description: string;
  end_date: string;
  status?: string;
  // Add other hackathon properties as needed
}

interface UseHackathonOptions {
  enabled?: boolean; // Whether to automatically fetch on mount
}

interface UseHackathonReturn {
  hackathon: Hackathon | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useHackathon = (
  hackathonId: string | undefined,
  options: UseHackathonOptions = {}
): UseHackathonReturn => {
  const { enabled = true } = options;
  const [hackathon, setHackathon] = useState<Hackathon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!hackathonId) {
      setError("Hackathon ID is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const bearerToken = localStorage.getItem("access_token");
      if (!bearerToken) {
        setError("No access token found. Please log in again.");
        return;
      }

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

      if (response.status === 401) {
        // Token might be expired or invalid
        localStorage.removeItem("access_token");
        setError("Session expired. Please log in again.");
        return;
      }

      if (response.status === 404) {
        setError("Hackathon not found");
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
      setHackathon(data);
      console.log("Hackathon fetched successfully:", data);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An error occurred while fetching hackathon";
      setError(errorMessage);
      console.error("Error fetching hackathon:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && hackathonId) {
      fetchData();
    }
  }, [hackathonId, enabled]);

  return {
    hackathon,
    loading,
    error,
    refetch: fetchData,
  };
};
