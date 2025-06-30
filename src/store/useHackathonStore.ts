
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Hackathon_details from '@/app/api/utils/interface';

interface HackathonState extends Partial<Hackathon_details> {
  setField: <K extends keyof Hackathon_details>(key: K, value: Hackathon_details[K]) => void;
  clearHackathon: () => void;
  getHackathonData: () => Partial<Hackathon_details>;
}

export const useHackathonStore = create<HackathonState>()(
  persist(
    (set, get) => ({
      title: '',
      description: '',
      venue: '',
      start_date: '',
      end_date: '',
      skills: [],
      judges: [],
      banner: null,

      setField: (key, value) => set({ [key]: value }),

      clearHackathon: () =>
        set({
          title: '',
          description: '',
          venue: '',
          details: null,
          grand_prize: undefined,
          start_date: '',
          end_date: '',
          visibility: false,
          min_team_size: undefined,
          max_team_size: undefined,
          organization: null,
          skills: [],
          judges: [],
          banner: null,
        }),

      getHackathonData: () => {
        const state = get();
        const { setField, clearHackathon, getHackathonData, ...data } = state;
        return data;
      },
    }),
    {
      name: 'hackathon-storage',
      partialize: (state) => {
        const { banner, ...persistable } = state;
        return persistable;
      },
    }
  )
);

