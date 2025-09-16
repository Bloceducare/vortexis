import { create } from "zustand";
import { persist } from "zustand/middleware";
import  Hackathon_details  from "@/app/api/utils/interface";

interface UserHackathons {
  hackathons: Hackathon_details[];
  addHackathon: (hackathon: Hackathon_details) => void;
  setHackathons: (hackathons: Hackathon_details[]) => void;
  removeHackathon: (id: string) => void;
  clearHackathons: () => void;
}

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
      name: "user-hackathons-storage", 
    }
  )
);
