// store/useUserProject.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userProject } from "@/app/api/utils/interface";

interface UserProjectState {
  project: userProject | null;
  setProject: (project: userProject) => void;
  clearProject: () => void;
}

export const useUserProjectStore = create<UserProjectState>()(
  persist(
    (set) => ({
      project: null,

      setProject: (project) => set({ project }),

      clearProject: () => set({ project: null }),
    }),
    {
      name: "user-project", 
    }
  )
);
