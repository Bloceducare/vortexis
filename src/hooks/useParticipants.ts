'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';
import { useHackathonStore } from '@/store/useHackathonStore';
import { useUserHackathonsStore } from "@/store/useUserHackathons";


const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function useParticipants() {
  // const queryClient = useQueryClient();
  const token = useAuthStore.getState().getToken();
  const { banner_image, venue } = useHackathonStore()
      const { setHackathons } = useUserHackathonsStore();
  


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
  

  const getHackathons = () => {
    return useQuery({
      queryKey: ['participant_hackathon'],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/my-registrations/`, {
          headers: getAuthHeaders()
        });
        if (!res.ok) throw new Error('Unable to fetch hackathon');
        return res.json();
      },
      staleTime: Infinity,
    })
  }


  // const data = await res.json(); 
        
  //       setHackathons(data);      


  return {
    getHackathons,
  };
}