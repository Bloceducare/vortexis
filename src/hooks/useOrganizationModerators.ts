import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useUserStore } from "@/store/useUserStore";
import { useRoleAccessStore } from "@/store/useRoleAccessStore";

export interface OrganizationInvitation {
  id: number;
  organization: number;
  organization_name: string;
  organization_logo?: string | null;
  inviter: number | string;
  inviter_name?: string | null;
  email: string;
  status: "pending" | "accepted" | "declined" | "expired" | string;
  message?: string;
  created_at: string;
  expires_at?: string;
  permissions?: string[];
  hackathon_scope?: "all" | "selected" | string;
  hackathon_ids?: number[];
  granted_hackathons?: { id: number; title: string }[];
}

export interface SentInvitation {
  id: number;
  email: string;
  status: "pending" | "accepted" | "declined" | "expired" | string;
  created_at: string;
  expires_at?: string;
  message?: string;
  organization?: number;
}

export function useOrganizationModerators() {
  const queryClient = useQueryClient();

  // 1. Public: Fetch invitation details by token (no auth headers required)
  const getInvitationByToken = (token: string) => {
    return useQuery<OrganizationInvitation>({
      queryKey: ["organization_invitation", token],
      queryFn: async () => {
        const baseUrl =
          process.env.NEXT_PUBLIC_API_URL ||
          process.env.NEXT_PUBLIC_BASE_URL ||
          "http://127.0.0.1:8000/api/v1";
        const cleanBase = baseUrl.replace(/\/+$/, "");

        const res = await fetch(
          `${cleanBase}/organization/invitation/${token}/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          let errorMsg = "Invitation not found or has expired.";
          try {
            const errData = await res.json();
            errorMsg =
              errData.detail ||
              errData.message ||
              errData.error ||
              (Array.isArray(errData.token) ? errData.token[0] : null) ||
              errorMsg;
          } catch {
            // ignore JSON parse error
          }
          throw new Error(errorMsg);
        }

        return res.json();
      },
      enabled: !!token,
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  };

  // 2. Accept Invitation: POST /api/v1/organization/invitations/accept/
  const acceptInvitationMutation = useMutation({
    mutationFn: async (token: string) => {
      try {
        const res = await api.post("/organization/invitations/accept/", {
          token,
        });
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const message =
          errorData?.detail ||
          errorData?.message ||
          errorData?.error ||
          (Array.isArray(errorData?.token) ? errorData.token[0] : null) ||
          "Failed to accept invitation";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      // Update local user role
      const currentUser = useUserStore.getState().user;
      if (currentUser) {
        useUserStore.getState().setUser({
          ...currentUser,
          is_moderator: true,
          is_organizer: true,
        });
      }
      // Force re-check of role access
      useRoleAccessStore.getState().clearAccess();

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ["organization_invitation"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.invalidateQueries({ queryKey: ["organizer_hackathon"] });
    },
  });

  // 3. Decline Invitation: POST /api/v1/organization/invitations/decline/
  const declineInvitationMutation = useMutation({
    mutationFn: async (token: string) => {
      try {
        const res = await api.post("/organization/invitations/decline/", {
          token,
        });
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const message =
          errorData?.detail ||
          errorData?.message ||
          errorData?.error ||
          (Array.isArray(errorData?.token) ? errorData.token[0] : null) ||
          "Failed to decline invitation";
        throw new Error(message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organization_invitation"] });
    },
  });

  // 4. Sent Invitations: GET /api/v1/organization/invitations/sent/{org_id}/
  const getSentInvitations = (organizationId: string | number) => {
    return useQuery<SentInvitation[]>({
      queryKey: ["organization_sent_invitations", String(organizationId)],
      queryFn: async () => {
        try {
          const res = await api.get(
            `/organization/invitations/sent/${organizationId}/`
          );
          // Normalize response: could be array or { results: [] }
          if (Array.isArray(res.data)) return res.data;
          if (Array.isArray(res.data?.results)) return res.data.results;
          if (Array.isArray(res.data?.invitations)) return res.data.invitations;
          return [];
        } catch (error: any) {
          throw new Error("Unable to fetch sent invitations");
        }
      },
      enabled: !!organizationId,
      staleTime: 1000 * 30, // 30 seconds
    });
  };

  // 5. Send Invite: POST /api/v1/organization/invite-moderator/{org_id}/
  const inviteModeratorMutation = useMutation({
    mutationFn: async ({
      organizationId,
      email,
      message,
      permissions,
      hackathon_scope,
      hackathon_ids,
    }: {
      organizationId: string | number;
      email: string;
      message?: string;
      permissions?: string[];
      hackathon_scope?: "all" | "selected";
      hackathon_ids?: number[];
    }) => {
      try {
        const res = await api.post(
          `/organization/invite-moderator/${organizationId}/`,
          {
            email: email.trim(),
            message: message?.trim() || "Join as moderator",
            permissions,
            hackathon_scope,
            hackathon_ids,
          }
        );
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const message =
          errorData?.email?.[0] ||
          errorData?.detail ||
          errorData?.message ||
          errorData?.error ||
          "Failed to invite moderator";
        throw new Error(message);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization_sent_invitations", String(variables.organizationId)],
      });
      queryClient.invalidateQueries({
        queryKey: ["organization_byId", String(variables.organizationId)],
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  // 6. Remove Active Moderator: POST /api/v1/organization/remove-moderator/{org_id}/
  const removeModeratorMutation = useMutation({
    mutationFn: async ({
      organizationId,
      username,
    }: {
      organizationId: string | number;
      username: string;
    }) => {
      try {
        const res = await api.post(
          `/organization/remove-moderator/${organizationId}/`,
          {
            moderators: [username],
          }
        );
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const message =
          errorData?.detail ||
          errorData?.message ||
          errorData?.error ||
          "Failed to remove moderator";
        throw new Error(message);
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["organization_byId", String(variables.organizationId)],
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  return {
    getInvitationByToken,
    acceptInvitationMutation,
    declineInvitationMutation,
    getSentInvitations,
    inviteModeratorMutation,
    removeModeratorMutation,
  };
}

export default useOrganizationModerators;
