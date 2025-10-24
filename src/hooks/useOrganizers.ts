'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Hackathon_details from '@/app/api/utils/interface';
import { useAuthStore } from '@/store/useAuthStore';
import { useHackathonStore } from '@/store/useHackathonStore';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function useOrganizer() {
  // const queryClient = useQueryClient();
  const token = useAuthStore.getState().getToken();
  const { banner_image, venue } = useHackathonStore()


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

  const createOrganization = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      const res = await fetch(`${apiUrl}/organization/create/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        let errorMessage = 'Failed to create organization';
  
        try {
          const errorData = await res.json();
          errorMessage =
            errorData?.non_field_errors?.[0] ||
            errorData?.message ||
            errorMessage;
        } catch (err) {
        }
  
        throw new Error(errorMessage);
      }
  
      return res.json();
    },
  });

  const getAllOrganization = useQuery({
    queryKey: ['organizations'],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/organization/my-organizations/`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Unable to fetch organizations');
      return res.json();
    },
    staleTime: Infinity,
  });

  const updateOrganization = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name?: string; description?: string } }) => {
      const res = await fetch(`${apiUrl}/organization/update/${id}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
  
      if (!res.ok) {
        let errorMessage = 'Failed to update organization';
  
        try {
          const errorData = await res.json();
          errorMessage =
            errorData?.non_field_errors?.[0] ||
            errorData?.message ||
            errorMessage;
        } catch (err) {
          // fallback: keep default errorMessage
        }
  
        throw new Error(errorMessage);
      }
  
      return res.json();
    },
  });

  const deleteOrganizationMutation = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await fetch(`${apiUrl}/organization/delete/${id}/`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
  
      if (!res.ok) {
        let errorMessage = "Failed to delete organization";
  
        try {
          const errorData = await res.json();
          errorMessage =
            errorData?.non_field_errors?.[0] ||
            errorData?.message ||
            errorMessage;
        } catch (err) {}
  
        throw new Error(errorMessage);
      }
  
      return res.json();
    },
  });
  
  
 
  const createHackathonMutation = useMutation({
    mutationFn: async (data: Hackathon_details) => {
      console.log(data)
      const formData = new FormData();

      formData.append('organization_id', String(data.organization_id || 0))
      formData.append('title', data.title || '');
      formData.append('description', data.description || '');
      formData.append('venue', venue || '');
      formData.append('start_date', data.start_date || '');
      formData.append('end_date', data.end_date || '');
      formData.append('submission_deadline', data.submission_deadline || '');
      formData.append('grand_prize', String(data.grand_prize || 0));
      formData.append('visibility', String(data.visibility ?? true));
      formData.append('evaluation_criteria', data.evaluation_criteria || '');
  
      if (banner_image instanceof File) {
        formData.append('banner_image', banner_image);
      }
  
      formData.append('prizes', String(data.prizes || ""));
      (data.skills ?? []).forEach((skillId: number) => {
        formData.append('skills', String(skillId));
      });
      formData.append('judges', String(data.judges || ""));
      formData.append('rules', String(data.rules || ""));

      console.log(formData)
  
      const res = await fetch(`${apiUrl}/hackathon/create/`, {
        method: 'POST',
        headers: getAuthHeaders(true),
        body: formData, 
      });
  
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(
          errorData?.non_field_errors?.[0] ||
          errorData?.message ||
          'Failed to create hackathon'
        );
      }     
    },
  });

  const updateHackathonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Hackathon_details }) => {
      const res = await fetch(`${apiUrl}/hackathon/${id}`, {
        method: 'PATCH',
        headers: getAuthHeaders(true),
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update hackathon');
      return res.json();
    },
  });

  const inviteJudgesMutation = useMutation({
    mutationFn: async ({ hackathon_id, emails }: { hackathon_id: string; emails: string[] }) => {
      const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/invite-judge/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ emails }),
      });
    
      const data = await res.json();
    
      if (!res.ok) {
        const error = new Error(data?.email?.[0] || 'Failed to invite judges');
        (error as any).response = data;
        throw error;
      }
    
      return data;
    }
    
    
  });

  const getHackathons = () => {
    return useQuery({
      queryKey: ['organizer_hackathon'],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/organizer/hackathons/`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Unable to fetch hackathon');
        return res.json();
      },
      staleTime: Infinity,
    })
  }

  const getHackathonById = (hackathon_id: string) => {
    return useQuery({
      queryKey: ['organizer_hackathon_byId', hackathon_id],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Unable to fetch submission');
        return res.json();
      },
      enabled: !!hackathon_id,
    });
  };

  const getOrganizationHackathon = (organization_id: string) => {
    return useQuery({
      queryKey: ['orgainzation_hackathon', organization_id],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/organization/${organization_id}/hackathons/`, {
          headers: getAuthHeaders()
        })
        if(!res.ok) throw new Error('Unable to fetch hackathons');
        return res.json()
      },
      enabled: !!organization_id
    })
  }

  const getOrganizationById = (organization_id: string) => {
    return useQuery({
      queryKey: ['organization_byId', organization_id],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/organization/get/${organization_id}/`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Unable to fetch organization');
        return res.json();
      },
      enabled: !!organization_id,
    });
  }




  const useParticipants = (hackathon_id: string) => {
    return useQuery({
      queryKey: ['hackathon_particpants_byid', hackathon_id],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/participants/`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Inable to fetch participants');
        return res.json();
      },
      enabled: !!hackathon_id,
    });
  };


    const useSubmissionById = (hackathon_id: string) => {
      return useQuery({
        queryKey: ['submission', hackathon_id],
        queryFn: async () => {
          const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/submissions/`, {
            headers: getAuthHeaders()
          });
          if (!res.ok) throw new Error('Unable to fetch submission');
          return res.json();
        },
        enabled: !!hackathon_id,
      });
    };


    const getHackathonJudges = (hackathon_id: string) => {
      return useQuery({
        queryKey: ['judges', hackathon_id], 
        queryFn: async () => {
          const res = await fetch(`${apiUrl}/hackathon/${hackathon_id}/judges/`, {
            headers: getAuthHeaders()
          });
          if (!res.ok) throw new Error('Unable to fetch submission');
          return res.json();
        },
        enabled: !!hackathon_id,
      })
    }

    const inviteModeratorsMutation = useMutation({
      mutationFn: async ({ organizationId, moderators }: { organizationId: string; moderators: string[] }) => {
        const res = await fetch(`${apiUrl}/organization/add-moderator/${organizationId}/`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ moderators }),
        });
      
        const data = await res.json();
      
        if (!res.ok) {
          const error = new Error(data?.email?.[0] || 'Failed to invite moderators');
          (error as any).response = data;
          throw error;
        }
      
        return data;
      }
    })

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
    inviteModeratorsMutation
  };
}