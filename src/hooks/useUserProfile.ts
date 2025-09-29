'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { useShallow } from 'zustand/shallow';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function useUser() {
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

  const getUserProfile = () => {
    return useQuery({
      queryKey: ['userProfile', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User ID is missing');
        const res = await fetch(`${apiUrl}/auth/profiles/${user.id}/`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Unable to fetch profile');
        const data = await res.json();
        return data;
      },
      enabled: !!user?.id, 
    });
  };

  const getPublicUser = (userId?: string) => {
    return useQuery({
      queryKey: ["publicUser", userId],
      queryFn: async () => {
        if (!userId) throw new Error("User ID is missing");
        const res = await fetch(`${apiUrl}/auth/users/public/${userId}/`, {
          headers: getAuthHeaders(), 
        }); 
        if (!res.ok) throw new Error("Unable to fetch public user profile");
        return res.json();
      },
      enabled: !!userId,
    });
  };

  const getUserDetail = () => {
    return useQuery({
      queryKey: ['userDetail', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User ID is missing');
        const res = await fetch(`${apiUrl}/auth/users/${user.id}/`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Unable to fetch profile');
        const data = await res.json();
        return data;
      },
      enabled: !!user?.id, 
    });
  };

  const updateUserDetail = () => {
    return useMutation({
      mutationFn: async ({ data }: { data: Record<string, any> }) => {
        const res = await fetch(`${apiUrl}/auth/users/${user?.id}/update/`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Unable to update profile');
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['detail'] });
      },
    });
  };

  /** 📌 Update user profile */
  const updateUserProfile = () => {
    return useMutation({
      mutationFn: async ({ data }: { data: Record<string, any> }) => {
        const res = await fetch(`${apiUrl}/auth/profiles/${user?.id}/update/`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Unable to update profile');
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
      },
    });
  };

  return {
    getUserProfile,
    updateUserProfile,
    updateUserDetail,
    getUserDetail,
    getPublicUser
  };
}
