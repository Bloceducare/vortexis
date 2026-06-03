'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserHackathonsStore } from "@/store/useUserHackathons";

import api from '@/lib/api';

export default function useParticipants() {
  const { setHackathons } = useUserHackathonsStore();


  const getHackathons = () => {
    return useQuery({
      queryKey: ['participant_hackathon'],
      queryFn: async () => {
        const res = await api.get('/hackathon/my-registrations/');
        const data = res.data;
        
        console.log(data);
        setHackathons(data);

        return data;
      },
      staleTime: Infinity,
    });
  };

 


  return {
    getHackathons,
  };
}