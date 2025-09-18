import { create } from "zustand";
import { persist } from "zustand/middleware";

// Define Hackathon type
export interface Hackathon {
  id?: number;
  title?: string;
  description?: string;
  grand_prize?: string;
  banner_image?: string | null;
  venue?: string;
  organization?: { name: string };
  participants_count: number;
  submissions_count: number;
  start_date?: string;
  end_date?: string;
}

// Zustand store interface
interface UserHackathons {
  hackathons: Hackathon[];
  addHackathon: (hackathon: Hackathon) => void;
  setHackathons: (hackathons: Hackathon[]) => void;
  removeHackathon: (id: number) => void;
  clearHackathons: () => void;
}

// Store
export const useUserHackathonsStore = create<UserHackathons>()(
  persist(
    (set) => ({
      hackathons: [],
      addHackathon: (hackathon) =>
        set((state) => ({
          hackathons: [...state.hackathons, hackathon],
        })),
      setHackathons: (hackathons) => set({ hackathons }),
      removeHackathon: (id) =>
        set((state) => ({
          hackathons: state.hackathons.filter((h) => h.id !== id),
        })),
      clearHackathons: () => set({ hackathons: [] }),
    }),
    {
      name: "user-hackathons-storage", // localStorage key
    }
  )
);
