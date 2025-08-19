'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { useShallow } from 'zustand/shallow';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function useHackathon() {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().getToken();

  const { user, setUser } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
    }))
  );

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

  /** === Queries === */
  const getAllHackathon = () => {
    return useQuery({
      queryKey: ['all_hackathon'],
      queryFn: async () => {
        if (!user?.id) throw new Error('User ID is missing');
        const res = await fetch(`${apiUrl}/hackathon/`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Unable to fetch hackathon');
        return res.json();
      },
      enabled: !!user?.id,
    });
  };

  /** === Mutations === */
  const registerUserForHackathon = () => {
    return useMutation({
      mutationFn: async (hackathonId: string) => {
        if (!user?.id) throw new Error('User must be logged in');
  
        const res = await fetch(`${apiUrl}/hackathon/${hackathonId}/register/`, {
          method: 'POST',
          headers: getAuthHeaders(),
        });
  
        if (!res.ok) throw new Error('Failed to register for hackathon');
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['all_hackathon'] });
      },
    });
  };
  

  return {
    getAllHackathon,
    registerUserForHackathon,
  };
}
