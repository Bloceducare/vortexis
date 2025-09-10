'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Team, userProject } from '@/app/api/utils/interface';
import { useAuthStore } from '@/store/useAuthStore';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';




interface JoinTeamPayload {
  teamId: string;
  hackathon_id: string;
}

export default function useProjects() {
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
      
    
    const getProject = () => {
        return useQuery({
        queryKey: ['team'],
        queryFn: async () => {
            const res = await fetch(`${apiUrl}/project/projects/`, {
                headers: getAuthHeaders(),
            });
            if (!res.ok){
              const errorData = await res.json().catch(() => ({}))
              throw new Error(errorData?.message || "Unable to create team");
            }
            return res.json();
        },
        // enabled: ,
        });
    };
    const createProjectMutation = useMutation({
        mutationFn: async (data: userProject) => {
          const res = await fetch(`${apiUrl}/project/projects/`, {
            method: "POST",
            headers: {
              ...getAuthHeaders(),
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });
      
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
      
            // Handle Django-style error responses
            const errorMessage =
              errorData?.non_field_errors?.[0] || // grab first non_field_error
              errorData?.detail || // sometimes APIs use "detail"
              errorData?.message || // fallback to "message"
              "Unable to create team";
      
            throw new Error(errorMessage);
          }
      
          return res.json();
        },
      });

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
        getProject,
        createProjectMutation,
        deleteTeamMutation,
    };
}
