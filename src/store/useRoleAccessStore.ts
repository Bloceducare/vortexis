import { create } from 'zustand';

interface RoleAccessState {
    canAccessJudges: boolean;
    canAccessOrganizer: boolean;
    canAccessDashboard: boolean;
    loading: boolean;
    lastChecked: number | null;
    setAccess: (access: Omit<RoleAccessState, 'setAccess' | 'clearAccess' | 'lastChecked'>) => void;
    clearAccess: () => void;
}

export const useRoleAccessStore = create<RoleAccessState>((set) => ({
    canAccessJudges: false,
    canAccessOrganizer: false,
    canAccessDashboard: false,
    loading: true,
    lastChecked: null,
    setAccess: (access) => set({ ...access, lastChecked: Date.now() }),
    clearAccess: () => set({
        canAccessJudges: false,
        canAccessOrganizer: false,
        canAccessDashboard: false,
        loading: true,
        lastChecked: null,
    }),
}));
