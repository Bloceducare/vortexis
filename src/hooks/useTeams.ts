'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Team } from '@/app/api/utils/interface';
import { useAuthStore } from '@/store/useAuthStore';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';


export default function useTeams() {
    const queryClient = useQueryClient();
     const token = useAuthStore.getState().getToken();
    
    
      const getAuthHeaders = (isFormData = false) => {
        const headers: Record<string, string> = {};
      
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      
        if (!isFormData) {
          headers['Content-Type'] = 'application/json';
        }
      
        return headers;
      };
      
    
    const getTeams = (hackathon_id: string) => {
        return useQuery({
        queryKey: ['teams', hackathon_id],
        queryFn: async () => {
            const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/teams/`, {
                headers: getAuthHeaders(),

            });
            if (!res.ok) throw new Error('Unable to fetch teams');
            return res.json();
        },
        enabled: !!hackathon_id,
        });
    };
    
    const createTeamMutation = () => {
        return useMutation({
          mutationFn: async (data: Team) => {
      
            const res = await fetch(`${apiUrl}/team/create-hackathon-team/`, {
              method: "POST",
              headers: getAuthHeaders(),
              body: JSON.stringify(data),
            });
  
            
            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              throw new Error(errorData?.message || "Unable to create team");
            }
      
            return res.json();
          },
        });
      };

const getAvailableTeams = (hackathon_id: string) => {
  return useQuery({
    queryKey: ['available-hackathons', hackathon_id], 
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/available-teams/`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) throw new Error('Unable to fetch available teams');
      return res.json();
    },
  });
};

const joinTeamMutation = ( hackathon_id: string) => {
  return useMutation({
    mutationFn: async (teamId: string,) => {
      const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/join-team/`, {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ team_id: teamId }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Unable to join team");
      }

      return res.json();
    },
  });
};

   const deleteTeamMutation = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        const res = await fetch(`${apiUrl}/team/${id}/`, {
          method: "DELETE",
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData?.message || "Unable to delete team");
        }

        return res.json();
      },
    });
  };


    
    return {
        getTeams,
        createTeamMutation,
        getAvailableTeams,
        joinTeamMutation,
        deleteTeamMutation,
    };
}
