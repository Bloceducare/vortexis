"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;


export default function useHackathon() {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().getToken();
  const setUser = useUserStore((state) => state.setUser);

  const getAuthHeaders = (isFormData = false) => {
    const headers: Record<string, string> = {};

    if (token) headers["Authorization"] = `Bearer ${token}`;
    if (!isFormData) headers["Content-Type"] = "application/json";

    return headers;
  };


  const getAllHackathon = () => {
    return useQuery({
      queryKey: ["all_hackathon"],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/`);
        if (!res.ok) throw new Error("Unable to fetch hackathons");
        return res.json();
      },
    });
  };

  const getHackathonById = (hackathon_id: string) => {
    return useQuery({
      queryKey: ["hackathon_byId", hackathon_id],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/`);
        if (!res.ok) throw new Error("Unable to fetch hackathon details");
        return res.json();
      },
      enabled: !!hackathon_id,
    });
  };

  /** === Protected Mutation === */
  const registerUserForHackathon = () => {
    return useMutation({
      mutationFn: async (hackathonId: string) => {
        if (!token) throw new Error("You must be logged in to register");

        const res = await fetch(
          `${apiUrl}/hackathon/${hackathonId}/register/`,
          {
            method: "POST",
            headers: getAuthHeaders(),
          }
        );

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData.error || "Failed to register for hackathon"
          );
        }

        return res.json();
      },
      onSuccess: async () => {
        queryClient.invalidateQueries({ queryKey: ["all_hackathon"] });

        // Refresh user profile to update roles (enable dashboard access)
        try {
          const userId = useUserStore.getState().user?.id;
          if (userId) {
            const userRes = await fetch(`${apiUrl}/auth/users/${userId}/`, {
              headers: getAuthHeaders(),
            });

            if (userRes.ok) {
              const userData = await userRes.json();
              setUser(userData);
            }
          }
        } catch (error) {
          console.error("Failed to refresh user profile after registration:", error);
        }
      },
    });
  };

  return {
    getAllHackathon,
    getHackathonById,
    registerUserForHackathon,
  };
}
