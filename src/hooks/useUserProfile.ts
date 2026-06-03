'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useUserStore } from '@/store/useUserStore';
import { useShallow } from 'zustand/shallow';

import api from '@/lib/api';

export default function useUser() {
  const queryClient = useQueryClient();
  const token = useAuthStore.getState().getToken();

  const { user, setUser } = useUserStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
    }))
  );



  const getUserProfile = () => {
    return useQuery({
      queryKey: ['userProfile', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User ID is missing');
        try {
          const res = await api.get(`/auth/profiles/${user.id}/`);
          return res.data;
        } catch (error: any) {
          throw new Error('Unable to fetch profile');
        }
      },
      enabled: !!user?.id, 
    });
  };

  const getPublicUser = (userId?: string) => {
    return useQuery({
      queryKey: ["publicUser", userId],
      queryFn: async () => {
        if (!userId) throw new Error("User ID is missing");
        try {
          const res = await api.get(`/auth/users/public/${userId}/`);
          return res.data;
        } catch (error: any) {
          throw new Error("Unable to fetch public user profile");
        }
      },
      enabled: !!userId,
    });
  };

  const getUserDetail = () => {
    return useQuery({
      queryKey: ['userDetail', user?.id],
      queryFn: async () => {
        if (!user?.id) throw new Error('User ID is missing');
        try {
          const res = await api.get(`/auth/users/${user.id}/`);
          return res.data;
        } catch (error: any) {
          throw new Error('Unable to fetch profile');
        }
      },
      enabled: !!user?.id, 
    });
  };

  const updateUserDetail = () => {
    return useMutation({
      mutationFn: async ({ data }: { data: Record<string, any> }) => {
        try {
          const res = await api.put(`/auth/users/${user?.id}/update/`, data);
          return res.data;
        } catch (error: any) {
          throw new Error('Unable to update profile');
        }
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['detail'] });
      },
    });
  };

  const updateUserProfile = () => {
    return useMutation({
      mutationFn: async ({ data }: { data: Record<string, any> }) => {
        try {
          const res = await api.put(`/auth/profiles/${user?.id}/update/`, data);
          return res.data;
        } catch (error: any) {
          throw new Error('Unable to update profile');
        }
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
