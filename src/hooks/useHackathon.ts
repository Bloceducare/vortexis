"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import api from "@/lib/api";


export default function useHackathon() {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().getToken();




  const getAllHackathon = () => {
    return useQuery({
      queryKey: ["all_hackathon"],
      queryFn: async () => {
        const res = await api.get("/hackathon/");
        return res.data;
      },
    });
  };

  const getHackathonById = (hackathon_id: string) => {
    return useQuery({
      queryKey: ["hackathon_byId", hackathon_id],
      queryFn: async () => {
        const res = await api.get(`/hackathon/${hackathon_id}/`);
        return res.data;
      },
      enabled: !!hackathon_id,
    });
  };

  /** === Protected Mutation === */
  const registerUserForHackathon = () => {
    return useMutation({
      mutationFn: async (hackathonId: string) => {
        if (!token) throw new Error("You must be logged in to register");

        try {
          const res = await api.post(`/hackathon/${hackathonId}/register/`);
          return res.data;
        } catch (error: any) {
          throw new Error(
            error.response?.data?.error || "Failed to register for hackathon"
          );
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["all_hackathon"] });

        // Optimistically update user's participant flag (safe approach)
        const currentUser = useUserStore.getState().user;
        if (currentUser) {
          useUserStore.getState().setUser({
            ...currentUser,
            is_participant: true,
          });
        }

        // Clear role access cache to trigger fresh permission check
        const { useRoleAccessStore } = require('@/store/useRoleAccessStore');
        useRoleAccessStore.getState().clearAccess();
      },
    });
  };

  return {
    getAllHackathon,
    getHackathonById,
    registerUserForHackathon,
  };
}
