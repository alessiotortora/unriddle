import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { User } from '@/db/schema';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
  lastUpdated: number | null;
}

export const useUser = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      lastUpdated: null,
      setUser: (user) => {
        // Only update if the user state actually changed
        const currentUser = get().user;
        if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
          set({ user, lastUpdated: Date.now() });
        }
      },
      resetUser: () => {
        // Only reset if there's actually a user to reset
        if (get().user !== null) {
          set({ user: null, lastUpdated: Date.now() });
        }
      },
    }),
    {
      name: 'user-storage',
      // Only persist user data and lastUpdated
      partialize: (state) => ({
        user: state.user,
        lastUpdated: state.lastUpdated,
      }),
    }
  )
);
