import { create } from "zustand"
import { persist } from "zustand/middleware"
import { UserTeam } from "@/app/api/utils/interface"

interface TeamState {
  team: UserTeam | null
  setTeam: (team: UserTeam) => void
  clearTeam: () => void
}

export const useTeamStore = create<TeamState>()(
  persist(
    (set) => ({
      team: null,
      setTeam: (team) => set({ team }),
      clearTeam: () => set({ team: null }),
    }),
    {
      name: "user-team", 
    }
  )
)
