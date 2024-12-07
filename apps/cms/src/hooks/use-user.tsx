import { create } from 'zustand';

import { User } from '@/db/schema';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
}

export const useUser = create<UserState>((set, get) => ({
  user: null,
  setUser: (user) => {
    // Only update if the user state actually changed
    const currentUser = get().user;
    if (JSON.stringify(currentUser) !== JSON.stringify(user)) {
    
      set({ user });
    }
  },
  resetUser: () => {
    // Only reset if there's actually a user to reset
    if (get().user !== null) {
     
      set({ user: null });
    }
  },
}));
