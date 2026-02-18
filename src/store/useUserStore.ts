import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/app/api/utils/interface';

interface UserState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;


  clickedUser: User | null;
   setclickedUser: (user: User) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => {
        set({ user: null });
        // Clear role access cache when user is cleared
        const { useRoleAccessStore } = require('@/store/useRoleAccessStore');
        useRoleAccessStore.getState().clearAccess();


       
      },
        clickedUser: null,
      setclickedUser: (user) => set({ clickedUser: user }),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
