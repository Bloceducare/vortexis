"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Hackathon_details from "@/app/api/utils/interface";
import { useAuthStore } from "@/store/useAuthStore";
import { useHackathonStore } from "@/store/useHackathonStore";

import api from '@/lib/api';



export default function useOrganizer() {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().getToken();
  const { banner_image_file, venue } = useHackathonStore();



const createOrganization = useMutation({
  mutationFn: async (payload: {
    name: string;
    description: string;
    website?: string;
    custom_url?: string;
    location?: string;
    tagline?: string;
    about?: string;
    logo_file?: string | null;
  }) => {
    try {
      const res = await api.post("/organization/create/", payload);
      return res.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.non_field_errors?.[0] ||
        errorData?.message ||
        "Failed to create organization";
      throw new Error(errorMessage);
    }
  },
  onSuccess: (data) => {
    const orgItem = data?.data || data?.organization || data;
    queryClient.setQueryData(["organizations"], (old: any) => {
      if (!old) {
        return { count: 1, next: null, previous: null, results: [orgItem] };
      }
      if (Array.isArray(old)) {
        return { count: old.length + 1, next: null, previous: null, results: [orgItem, ...old] };
      }
      if (old && Array.isArray(old.results)) {
        const exists = old.results.some((o: any) => o.id === orgItem.id);
        if (exists) return old;
        return {
          ...old,
          count: (old.count || old.results.length) + 1,
          results: [orgItem, ...old.results],
        };
      }
      return { count: 1, next: null, previous: null, results: [orgItem] };
    });
    queryClient.invalidateQueries({ queryKey: ["organizations"] });
    queryClient.refetchQueries({ queryKey: ["organizations"] });
  },
});


 const updateOrganization = useMutation({
  mutationFn: async ({
    id,
    payload,
  }: {
    id: string;
    payload: {
      name: string;
      description: string;
      website?: string;
      custom_url?: string;
      location?: string;
      tagline?: string;
      about?: string;
      logo_file?: string | null;
    };
  }) => {
    try {
      const res = await api.put(`/organization/update/${id}/`, payload);
      return res.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      const errorMessage =
        errorData?.non_field_errors?.[0] ||
        errorData?.message ||
        "Failed to update organization";
      throw new Error(errorMessage);
    }
  },
  onSuccess: (updated) => {
    const orgItem = updated?.data || updated?.organization || updated;
    queryClient.setQueryData(["organizations"], (old: any) => {
      if (!old) return old;
      if (Array.isArray(old)) {
        return old.map((org: any) => (org.id === orgItem.id ? { ...org, ...orgItem } : org));
      }
      if (old && Array.isArray(old.results)) {
        return {
          ...old,
          results: old.results.map((org: any) =>
            org.id === orgItem.id ? { ...org, ...orgItem } : org
          ),
        };
      }
      return old;
    });
    queryClient.invalidateQueries({ queryKey: ["organizations"] });
    queryClient.refetchQueries({ queryKey: ["organizations"] });
  },
});


  const getAllOrganization = useQuery({
    queryKey: ["organizations"],
    queryFn: async () => {
      try {
        const res = await api.get("/organization/my-organizations/");
        return res.data;
      } catch (error: any) {
        throw new Error("Unable to fetch organizations");
      }
    },
    staleTime: 1000 * 30, // 30 seconds
  });


  const deleteOrganizationMutation = useMutation({
    mutationFn: async (id: string | number) => {
      try {
        const res = await api.delete(`/organization/delete/${id}/`);
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.non_field_errors?.[0] ||
          errorData?.message ||
          "Failed to delete organization";
        throw new Error(errorMessage);
      }
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["organizations"], (old: any) => {
        if (!old) return old;
        if (Array.isArray(old)) {
          return old.filter((org: any) => org.id !== id && String(org.id) !== String(id));
        }
        if (old && Array.isArray(old.results)) {
          return {
            ...old,
            count: Math.max(0, (old.count || old.results.length) - 1),
            results: old.results.filter(
              (org: any) => org.id !== id && String(org.id) !== String(id)
            ),
          };
        }
        return old;
      });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
      queryClient.refetchQueries({ queryKey: ["organizations"] });
    },
  });
  
const createHackathonMutation = useMutation({
  mutationFn: async (data: Hackathon_details) => {
   
    const payload: Hackathon_details = {
      ...data,
      banner_image_file: data.banner_image_file ?? null,
    };

    try {
      const res = await api.post("/hackathon/create/", payload);
      return res.data;
    } catch (error: any) {
      const errorData = error.response?.data;
      throw new Error(
        errorData?.non_field_errors?.[0] ||
          errorData?.message ||
          "Failed to create hackathon"
      );
    }
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["organizer_hackathon"] });
    queryClient.invalidateQueries({ queryKey: ["hackathon"] });
    queryClient.invalidateQueries({ queryKey: ["all_hackathon"] });
    queryClient.invalidateQueries({ queryKey: ["participant_hackathon"] });
    queryClient.invalidateQueries({ queryKey: ["organizations"] });
  },
});


  const updateHackathonMutation = useMutation({
    mutationFn: async ({
      hackathonId,
      data,
    }: {
      hackathonId: string;
      data: Hackathon_details;
    }) => {
      try {
        const res = await api.patch(`/hackathon/${hackathonId}/`, data);
        return res.data;
      } catch (error: any) {
        throw new Error("Failed to update hackathon");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["organizer_hackathon"] });
      queryClient.invalidateQueries({ queryKey: ["hackathon"] });
      queryClient.invalidateQueries({ queryKey: ["hackathon_overview"] });
      queryClient.invalidateQueries({ queryKey: ["all_hackathon"] });
      queryClient.invalidateQueries({ queryKey: ["hackathon_byId"] });
    },
  });

  const inviteJudgesMutation = useMutation({
    mutationFn: async ({
      hackathon_id,
      emails,
    }: {
      hackathon_id: string;
      emails: string[];
    }) => {
      try {
        const res = await api.post(`/hackathon/${hackathon_id}/invite-judge/`, { emails });
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const newError = new Error(errorData?.email?.[0] || "Failed to invite judges");
        (newError as any).response = errorData;
        throw newError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["judges"] });
      queryClient.invalidateQueries({ queryKey: ["hackathon_overview"] });
    },
  });

  const getHackathons = () => {
    return useQuery({
      queryKey: ["organizer_hackathon"],
      queryFn: async () => {
        try {
          const res = await api.get("/hackathon/organizer/hackathons/");
          return res.data;
        } catch (error: any) {
          throw new Error("Unable to fetch hackathon");
        }
      },
      staleTime: Infinity,
    });
  };

  const getHackathonById = (hackathon_id: string) => {
    return useQuery({
      queryKey: ["organizer_hackathon_byId", hackathon_id],
      queryFn: async () => {
        try {
          const res = await api.get(`/hackathon/${hackathon_id}/`);
          return res.data;
        } catch (error: any) {
          throw new Error("Unable to fetch submission");
        }
      },
      enabled: !!hackathon_id,
      staleTime: 1000 * 60 * 10, // 10 minutes stale time
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    });
  };

  const getOrganizationHackathon = (organization_id: string) => {
    return useQuery({
      queryKey: ["orgainzation_hackathon", organization_id],
      queryFn: async () => {
        try {
          const res = await api.get(`/hackathon/organization/${organization_id}/hackathons/`);
          return res.data;
        } catch (error: any) {
          throw new Error("Unable to fetch hackathons");
        }
      },
      enabled: !!organization_id,
    });
  };

  const getOrganizationById = (organization_id: string) => {
    return useQuery({
      queryKey: ["organization_byId", organization_id],
      queryFn: async () => {
        try {
          const res = await api.get(`/organization/get/${organization_id}/`);
          return res.data;
        } catch (error: any) {
          throw new Error("Unable to fetch organization");
        }
      },
      enabled: !!organization_id,
    });
  };

  const useParticipants = (hackathon_id: string) => {
    return useQuery({
      queryKey: ["hackathon_particpants_byid", hackathon_id],
      queryFn: async () => {
        try {
          const res = await api.get(`/hackathon/${hackathon_id}/participants/`);
          return res.data;
        } catch (error: any) {
          throw new Error("Unable to fetch participants");
        }
      },
      enabled: !!hackathon_id,
      staleTime: 1000 * 60 * 10, // 10 minutes stale time
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    });
  };

  const useSubmissionById = (hackathon_id: string) => {
    return useQuery({
      queryKey: ["submission", hackathon_id],
      queryFn: async () => {
        try {
          const res = await api.get(`/hackathon/${hackathon_id}/submissions/`);
          return res.data;
        } catch (error: any) {
          throw new Error("Unable to fetch submission");
        }
      },
      enabled: !!hackathon_id,
      staleTime: 1000 * 60 * 10, // 10 minutes stale time
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    });
  };

  const getHackathonJudges = (hackathon_id: string) => {
    return useQuery({
      queryKey: ["judges", hackathon_id],
      queryFn: async () => {
        try {
          const res = await api.get(`/hackathon/${hackathon_id}/judges/`);
          return res.data;
        } catch (error: any) {
          throw new Error("Unable to fetch submission");
        }
      },
      enabled: !!hackathon_id,
      staleTime: 1000 * 60 * 10, // 10 minutes stale time
      gcTime: 1000 * 60 * 30,
      refetchOnWindowFocus: false,
    });
  };

  const inviteModeratorsMutation = useMutation({
    mutationFn: async ({
      organizationId,
      email,
      message,
    }: {
      organizationId: string;
      email: string[];
      message: string;
    }) => {
      try {
        const res = await api.post(`/organization/invite-moderator/${organizationId}/`, {
          email: email,
          mesage: message,
        });
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const newError = new Error(
          errorData?.email?.[0] || "Failed to invite moderators"
        );
        (newError as any).response = errorData;
        throw newError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["moderators"] });
      queryClient.invalidateQueries({ queryKey: ["organizations"] });
    },
  });

  const approveSubmissionMutation = useMutation({
    mutationFn: async ({
      hackathonId,
      submissionId,
    }: {
      hackathonId: string | number;
      submissionId: number | string;
    }) => {
      try {
        const res = await api.post(
          `/hackathon/${hackathonId}/submissions/${submissionId}/approve/`
        );
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        throw new Error(
          errorData?.error ||
            errorData?.detail ||
            errorData?.message ||
            "Failed to approve submission"
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["submission", String(variables.hackathonId)],
      });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["live-reviews"] });
    },
  });

  const rejectSubmissionMutation = useMutation({
    mutationFn: async ({
      hackathonId,
      submissionId,
      reason,
    }: {
      hackathonId: string | number;
      submissionId: number | string;
      reason?: string;
    }) => {
      try {
        const res = await api.post(
          `/hackathon/${hackathonId}/submissions/${submissionId}/reject/`,
          { reason: reason || "Submission does not meet criteria." }
        );
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        throw new Error(
          errorData?.error ||
            errorData?.detail ||
            errorData?.message ||
            "Failed to reject submission"
        );
      }
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["submission", String(variables.hackathonId)],
      });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      queryClient.invalidateQueries({ queryKey: ["live-reviews"] });
    },
  });

  // const updateHackathonMutation = useMutation({
  //   mutationFn: async ({ id, data }: { id: string; data: Hackathon_details }) => {
  //     const formData = new FormData();

  //     if (data.organization_id !== undefined) {
  //       formData.append('organization_id', String(data.organization_id));
  //     }
  //     if (data.title !== undefined) {
  //       formData.append('title', data.title);
  //     }
  //     if (data.description !== undefined) {
  //       formData.append('description', data.description);
  //     }
  //     if (data.venue !== undefined) {
  //       formData.append('venue', data.venue);
  //     }
  //     if (data.start_date !== undefined) {
  //       formData.append('start_date', data.start_date);
  //     }
  //     if (data.end_date !== undefined) {
  //       formData.append('end_date', data.end_date);
  //     }
  //     if (data.submission_deadline !== undefined) {
  //       formData.append('submission_deadline', data.submission_deadline);
  //     }
  //     if (data.grand_prize !== undefined) {
  //       formData.append('grand_prize', String(data.grand_prize));
  //     }
  //     if (data.visibility !== undefined) {
  //       formData.append('visibility', String(data.visibility));
  //     }
  //     if (data.evaluation_criteria !== undefined) {
  //       formData.append('evaluation_criteria', data.evaluation_criteria);
  //     }

  //     if (banner_image instanceof File) {
  //       formData.append('banner_image', banner_image);
  //     }

  //     if (data.prizes !== undefined) {
  //       formData.append('prizes', String(data.prizes));
  //     }

  //     if (data.skills !== undefined) {
  //       data.skills.forEach((skillId: number) => {
  //         formData.append('skills', String(skillId));
  //       });
  //     }

  //     if (data.judges !== undefined) {
  //       formData.append('judges', String(data.judges));
  //     }

  //     if (data.rules !== undefined) {
  //       formData.append('rules', String(data.rules));
  //     }

  //     const res = await fetch(`${apiUrl}/hackathon/${id}/`, {
  //       method: 'PATCH',
  //       headers: getAuthHeaders(true),
  //       body: formData,
  //     });

  //     if (!res.ok) {
  //       const errorData = await res.json();
  //       throw new Error(
  //         errorData?.non_field_errors?.[0] ||
  //           errorData?.message ||
  //         'Failed to update hackathon'
  //       }
  //     }})

  return {
    createHackathonMutation,
    updateHackathonMutation,
    inviteJudgesMutation,
    useSubmissionById,
    getHackathons,
    getHackathonJudges,
    getHackathonById,
    useParticipants,
    createOrganization,
    getAllOrganization,
    updateOrganization,
    deleteOrganizationMutation,
    getOrganizationHackathon,
    getOrganizationById,
    inviteModeratorsMutation,
    approveSubmissionMutation,
    rejectSubmissionMutation,
  };
}
