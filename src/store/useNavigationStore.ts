import { create } from 'zustand';

interface Hackathon {
  id: string;
  slug: string;
  name: string;
}

interface HackathonState {
  hackathons: Hackathon[];
  setHackathons: (data: Hackathon[]) => void;
  getIdBySlug: (slug: string) => string | undefined;
}

export const useHackathonStore = create<HackathonState>((set, get) => ({
  hackathons: [],
  setHackathons: (data) => set({ hackathons: data }),
  getIdBySlug: (slug) => {
    const match = get().hackathons.find((h) => h.slug === slug);
    return match?.id;
  },
}));
