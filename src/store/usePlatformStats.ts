import { create } from "zustand";
import { persist } from "zustand/middleware";
import { PlatformStats } from "@/app/api/utils/interface";

interface PlatformStatState {
  platformStat: PlatformStats | null;
  setPlatformStats: (stat: any) => void;
  set: (stat: any) => void;
  clearStats: () => void;
  getPlatformStats: () => PlatformStats | null;
}

const normalizeStats = (raw: any): PlatformStats => {
  if (!raw) {
    return {
      active_participants: 0,
      hackathons_hosted: 0,
      organizations: 0,
      activeParticipants: 0,
      hackathonsHosted: 0,
    };
  }
  const data = raw.data || raw;
  const activeParticipants = Number(data.activeParticipants ?? data.active_participants ?? 0);
  const hackathonsHosted = Number(data.hackathonsHosted ?? data.hackathons_hosted ?? 0);
  const organizations = Number(data.organizations ?? 0);

  return {
    active_participants: activeParticipants,
    hackathons_hosted: hackathonsHosted,
    organizations: organizations,
    activeParticipants: activeParticipants,
    hackathonsHosted: hackathonsHosted,
  };
};

export const usePlatformStats = create<PlatformStatState>()(
  persist(
    (set, get) => ({
      platformStat: null,
      setPlatformStats: (stat: any) => set({ platformStat: normalizeStats(stat) }),
      set: (stat: any) => set({ platformStat: normalizeStats(stat) }),
      clearStats: () => set({ platformStat: null }),
      getPlatformStats: () => get().platformStat,
    }),
    {
      name: "platform-stats-storage",
    }
  )
);

export const UsePlatformStatistics = usePlatformStats;
export const PlatformStatistics = usePlatformStats;
export const usePlatformStatsStore = usePlatformStats;
export default usePlatformStats;
