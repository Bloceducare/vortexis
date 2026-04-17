'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Team } from '@/app/api/utils/interface';
import { useAuthStore } from '@/store/useAuthStore';
import { useTeamStore } from '@/store/useTeamStore';
import api from '@/lib/api';


interface JoinTeamPayload {
  teamId: string;
  hackathon_id: string;
  teamName: string;
}

interface addMember {
  team_id: string;
  member_email: string;
}

interface approveOrReject {
  team_id: string | number;
  user_id: string | number;
  join_requests_id: string | number;
}

export default function useTeams() {
    const queryClient = useQueryClient();
     const token = useAuthStore.getState().getToken();
     const { setTeam,  } = useTeamStore()
    
    

    
      const getTeam = (hackathon_id: string) => {
        return useQuery({
          queryKey: ['team', hackathon_id],
          queryFn: async () => {
            try {
              const res = await api.get(`/team/teams/by_hackathon/?hackathon_id=${hackathon_id}`);
              setTeam(res.data);
              return res.data;
            } catch (error: any) {
              throw new Error(error.response?.data?.message || "Unable to fetch team");
            }
          },
          enabled: !!hackathon_id,
        });
      };
      
    
    const createTeamMutation = useMutation({
      mutationFn: async (data: Team) => {
        try {
          const res = await api.post("/team/teams/", data);
          return res.data;
        } catch (error: any) {
          const errorData = error.response?.data;
          const errorMessage =
            errorData?.non_field_errors?.[0] ||
            errorData?.detail ||
            errorData?.message ||
            "Unable to create team";
          throw new Error(errorMessage);
        }
      },
    });



   

const getAvailableTeams = (hackathon_id: string) => {
  return useQuery({
    queryKey: ['available-hackathons', hackathon_id], 
    queryFn: async () => {
      try {
        const res = await api.get(`/hackathon/${hackathon_id}/available-teams/`);
        return res.data;
      } catch (error: any) {
        throw new Error('Unable to fetch available teams');
      }
    },
  });
};
const joinTeamMutation = () => {
  return useMutation({
    mutationFn: async ({ teamId, hackathon_id, teamName }: JoinTeamPayload) => {
      try {
        const res = await api.post("/team/teams/request_to_join/", { team_id: teamId });
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const message =
          errorData?.message ||
          errorData?.detail ||
          errorData?.non_field_errors?.[0] ||
          "Unable to join team";
        throw new Error(message);
      }
    },
  });
};

const getmyJoinRequests = () => {
  return useQuery({
    queryKey: ['my-join-requests'],
    queryFn: async () => {
      try {
        const res = await api.get("/team/teams/my_join_requests/");
        return res.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || "Unable to fetch join requests");
      }
    }
  });
}
    const getOrganizerTeamJoinRequest = () => {
      return useQuery({
        queryKey: ["team-join-requests"],
        queryFn: async () => {
          try {
            const res = await api.get("/team/teams/join_requests/")
            return res.data;
          } catch(error: any) {
            throw new Error(error.response?.data?.message || "Unable to fetch join requests");
          }
        }
      })
    }

      const approveTeamJoinRequest = useMutation({
      mutationFn: async (data: approveOrReject) => {
        try {
          const res = await api.post("/team/teams/approve_join_request/", data);
          return res.data;
        } catch(error: any) {
          const errorData = error.response?.data;
          const errorMessage =
            errorData?.non_field_errors?.[0] ||
            errorData?.detail ||
            errorData?.message ||
            "Unable to create team";
          throw new Error(errorMessage);
        }
      }
    })

  const rejectTeamJoinRequest = useMutation({
      mutationFn: async (data: approveOrReject) => {
        try {
          const res = await api.post("/team/teams/reject_join_request/", data);
          return res.data;
        } catch(error: any) {
          const errorData = error.response?.data;
          const errorMessage =
            errorData?.non_field_errors?.[0] ||
            errorData?.detail ||
            errorData?.message ||
            "Unable to create team";
          throw new Error(errorMessage);
        }
      }
    })
   


   const deleteTeamMutation = () => {
    return useMutation({
      mutationFn: async (id: string) => {
        try {
          const res = await api.delete(`/team/${id}/`);
          return res.data;
        } catch(error: any) {
          throw new Error(error.response?.data?.message || "Unable to delete team");
        }
      },
    });
  };

  const leaveTeam = () => {
    return useMutation({
      mutationFn: async (teamId: string) => {
        try {
          const res = await api.post(`/team/teams/${teamId}/leave_team/`);
          return res.data;
        } catch(error: any) {
          const errorData = error.response?.data;
          throw new Error(
            errorData?.message ||
              errorData?.non_field_errors?.[0] ||
              "Unable to leave team"
          );
        }
      },
    });
  };

  const inviteMembers = () => {
    return useMutation({
      mutationFn: async ({team_id, member_email } : addMember ) => {
        try {
          const res = await api.post(`/team/teams/${team_id}/add_member/`, { member_email });
          return res.data;
        } catch(error: any) {
          const errorData = error.response?.data;
          const message =
            errorData?.member_email ||
            errorData?.detail ||
            errorData?.non_field_errors?.[0] ||
            "Unable to join team";
          throw new Error(message);
        }
      }
    })
  }

  const acceptInvitation = useMutation({
    mutationFn: async (token: string) => {
      try {
        const res = await api.post("/team/teams/accept_invitation/", { token });
        return res.data;
      } catch(error: any) {
        throw new Error(error.response?.data?.message || "Unable to accept invitation");
      }
    },
  });

    
    return {
        getTeam,
        createTeamMutation,
        getAvailableTeams,
        joinTeamMutation,
        deleteTeamMutation,
        inviteMembers,
        leaveTeam,
        acceptInvitation,
        getOrganizerTeamJoinRequest,
        approveTeamJoinRequest,
        rejectTeamJoinRequest,
        getmyJoinRequests
    };
}
