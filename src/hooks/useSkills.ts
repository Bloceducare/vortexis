'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/useAuthStore';


import api from '@/lib/api';


export default function useSkills() {
  const queryClient = useQueryClient();

      const token = useAuthStore.getState().getToken();

      

        const getAllSkills = () => {
          return useQuery({
            queryKey: ['skills'],
            queryFn: async () => {
              try {
                const res = await api.get("/auth/skills/");
                return res.data;
              } catch (error: any) {
                throw new Error("Unable to fetch Skill");
              }
            },
            staleTime: Infinity,
          })
        }

        const createSkill = useMutation({
          mutationFn: async (name: string) => {
            try {
              const res = await api.post("/auth/skills/", { name });
              return res.data;
            } catch (error: any) {
              const errorData = error.response?.data;
              const errorMessage =
                errorData?.non_field_errors?.[0] ||
                errorData?.detail ||
                errorData?.message ||
                "Unable to create project";
              throw new Error(errorMessage);
            }
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
