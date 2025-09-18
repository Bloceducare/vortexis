'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';


const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';


export default function useSkills() {
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
      

        const getAllSkills = () => {
          return useQuery({
            queryKey: ['skills'],
            queryFn: async () => {
              const res = await fetch(`${apiUrl}/auth/skills/`, {
                headers: getAuthHeaders()
              });
              if (!res.ok) throw new Error('Unable to fetch Skill');
              return res.json();
            },
            staleTime: Infinity,
          })
        }

        const createSkill = useMutation({
          mutationFn: async (name: string) => {
          const res = await fetch(`${apiUrl}//auth/skills/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify({name}),
          })
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




        return {
            getAllSkills,
            createSkill
        }
}
