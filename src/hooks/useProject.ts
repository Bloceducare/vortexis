'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Team, userProject } from '@/app/api/utils/interface';
import { useAuthStore } from '@/store/useAuthStore';

import api from '@/lib/api';

export default function useProjects() {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().getToken();



  /** ✅ Get projects */
  const getProject = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        try {
          const res = await api.get("/project/projects/");
          return res.data;
        } catch (error: any) {
          throw new Error(error.response?.data?.message || 'Unable to fetch projects');
        }
      },
    });
  };

  const createProjectMutation = useMutation({
    mutationFn: async ({ data, hackathon_id }: { data: userProject; hackathon_id: string }) => {
      try {
        const res = await api.post(`/project/hackathons/${hackathon_id}/projects/`, data);
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.non_field_errors?.[0] ||
          errorData?.detail ||
          errorData?.message ||
          'Unable to create project';
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({data, id}: {data: userProject, id: string}) => {
      try {
        const res = await api.put(`/project/projects/${id}/`, data);
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.non_field_errors?.[0] ||
          errorData?.project ||
          errorData?.message ||
          'Unable to update project';
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  const submitProjectMutation = useMutation({
    mutationFn: async ({ project, hackathon_id }: { project: any; hackathon_id: string }) => {
      try {
        const res = await api.post(`/hackathon/${hackathon_id}/submit-project/`, { project_id: project });
        return res.data;
      } catch (error: any) {
        const errorData = error.response?.data;
        const errorMessage =
          errorData?.non_field_errors?.[0] ||
          (Array.isArray(errorData?.project) ? errorData.project[0] : errorData?.project) ||
          errorData?.message ||
          'Unable to Submit project';
        throw new Error(errorMessage);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
  


  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const res = await api.delete(`/project/projects/${id}/`);
        return res.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Unable to delete project');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });


  return {
    getProject,
    createProjectMutation,
    deleteProjectMutation,
    submitProjectMutation,
    updateProjectMutation
  };
}

