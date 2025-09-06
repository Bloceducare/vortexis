'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Team } from '@/app/api/utils/interface';
import { useAuthStore } from '@/store/useAuthStore';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';




interface JoinTeamPayload {
  teamId: string;
  hackathon_id: string;
}

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
      
    
    const getTeam = (hackathon_id: string) => {
        return useQuery({
        queryKey: ['team', hackathon_id],
        queryFn: async () => {
            const res = await fetch(`${apiUrl}/team/teams/by_hackathon/?hackathon_id=${hackathon_id}`, {
                headers: getAuthHeaders(),
            });
            if (!res.ok){
              const errorData = await res.json().catch(() => ({}))
              throw new Error(errorData?.message || "Unable to create team");
            }
            return res.json();
        },
        enabled: !!hackathon_id,
        });
    };
    
    const createProjectMutation = () => {
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
        getTeam,
        createProjectMutation,
        deleteTeamMutation,
    };
}
