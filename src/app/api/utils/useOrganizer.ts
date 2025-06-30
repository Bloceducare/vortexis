'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Hackathon_details from './interface';

const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export default function useOrganizer() {
  const queryClient = useQueryClient();

 
  const createHackathonMutation = useMutation({
    mutationFn: async (data: Hackathon_details) => {
      const res = await fetch(`${apiUrl}/hackathon`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create hackathon');
      return res.json();
    },
  });


  const updateHackathonMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Hackathon_details }) => {
      const res = await fetch(`${apiUrl}/hackathon/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update hackathon');
      return res.json();
    },
  });

  const inviteJudgesMutation = useMutation({
    mutationFn: async ({ hackathonId, emails }: { hackathonId: string; emails: string[] }) => {
      const res = await fetch(`${apiUrl}/hackathon/${hackathonId}/invite-judge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails }),
      });

      if (!res.ok) throw new Error('Failed to invite judges');
      return res.json();
    },
  });


  const useParticipants = () =>
    useQuery({
      queryKey: ['participants'],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon`);
        if (!res.ok) throw new Error('Unable to fetch participants');
        return res.json();
      },
    });

 
  const useSubmissions = () =>
    useQuery({
      queryKey: ['submissions'],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/submission`);
        if (!res.ok) throw new Error('Unable to fetch submissions');
        return res.json();
      },
    });


  const useSubmissionById = (id: string) =>
    useQuery({
      queryKey: ['submission', id],
      queryFn: async () => {
        const res = await fetch(`${apiUrl}/hackathon/${id}/submission/`);
        if (!res.ok) throw new Error('Unable to fetch submission');
        return res.json();
      },
      enabled: !!id, 
    });

  const deleteSubmissionMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`${apiUrl}/hackathon/${id}/submission/`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Unable to delete submission');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
    },
  });

  return {
    createHackathonMutation,
    updateHackathonMutation,
    inviteJudgesMutation,
    useParticipants,
    useSubmissions,
    useSubmissionById,
    deleteSubmissionMutation,
  };
}