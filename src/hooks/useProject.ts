'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Team, userProject } from '@/app/api/utils/interface';
import { useAuthStore } from '@/store/useAuthStore';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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

  /** ✅ Get projects */
  const getProject = () => {
    return useQuery({
      queryKey: ['projects'],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/project/projects/`, {
          headers: getAuthHeaders(),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData?.message || 'Unable to fetch projects');
        }

        return res.json();
      },
    });
  };

  /** ✅ Create project */
  const createProjectMutation = useMutation({
    mutationFn: async (data: userProject) => {
      const res = await fetch(`${apiUrl}/project/projects/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));

        const errorMessage =
          errorData?.non_field_errors?.[0] ||
          errorData?.detail ||
          errorData?.message ||
          'Unable to create project';

        throw new Error(errorMessage);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  /** ✅ Delete project */
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiUrl}/project/projects/${id}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || 'Unable to delete project');
      }

      return res.json();
    },
    onSuccess: () => {
      // ✅ refresh project list after deletion
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });

  return {
    getProject,
    createProjectMutation,
    deleteProjectMutation,
  };
}

