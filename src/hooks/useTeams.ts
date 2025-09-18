'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Team } from '@/app/api/utils/interface';
import { useAuthStore } from '@/store/useAuthStore';
import { useTeamStore } from '@/store/useTeamStore';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';


interface JoinTeamPayload {
  teamId: string;
  hackathon_id: string;
}

interface addMember {
  team_id: string;
  member_email: string;
}

export default function useTeams() {
    const queryClient = useQueryClient();
     const token = useAuthStore.getState().getToken();
     const { setTeam,  } = useTeamStore()
    
    
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
            const res = await fetch(
              `${apiUrl}/team/teams/by_hackathon/?hackathon_id=${hackathon_id}`,
              { headers: getAuthHeaders() }
            );
      
            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              throw new Error(errorData?.message || "Unable to fetch team");
            }
      
            const data = await res.json();
            setTeam(data);
            return data; // ✅ return parsed JSON
          },
          enabled: !!hackathon_id,
        });
      };
      
    
    const createTeamMutation = useMutation({
      mutationFn: async (data: Team) => {
        const res = await fetch(`${apiUrl}/team/teams/`, {
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
const joinTeamMutation = () => {
  return useMutation({
    mutationFn: async ({ teamId, hackathon_id }: JoinTeamPayload) => {
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
        // ✅ Look for backend error keys
        const message =
          errorData?.message ||
          errorData?.detail ||
          errorData?.non_field_errors?.[0] ||
          "Unable to join team";

        throw new Error(message);
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

  const leaveTeam = () => {
    return useMutation({
      mutationFn: async (teamId: string) => {
        const res = await fetch(`${apiUrl}/team/teams/${teamId}/leave_team/`, {
          method: "POST", 
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
        });
  
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(
            errorData?.message ||
              errorData?.non_field_errors?.[0] ||
              "Unable to leave team"
          );
        }
  
        return res.json();
      },
    });
  };

  const inviteMembers = () => {
    return useMutation({
      mutationFn: async ({team_id, member_email } : addMember ) => {
        const res = await fetch(`${apiUrl}/team/teams/${team_id}/add_member/`, {
          method: "POST",
          headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ member_email: member_email }),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          // ✅ Look for backend error keys
          const message =
            errorData?.message ||
            errorData?.detail ||
            errorData?.non_field_errors?.[0] ||
            "Unable to join team";
  
          throw new Error(message);
        }

        return res.json()
      }
    })
  }

    
    return {
        getTeam,
        createTeamMutation,
        getAvailableTeams,
        joinTeamMutation,
        deleteTeamMutation,
        inviteMembers,
        leaveTeam
    };
}
