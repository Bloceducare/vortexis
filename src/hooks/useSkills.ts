'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';


export default function useSkills() {

    const getAuthHeaders = (isFormData = false) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
        const headers: Record<string, string> = {
          Authorization: `Bearer ${token || ''}`,
        };
      
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

        return {
            getAllSkills
        }
}
