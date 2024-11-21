import { create } from 'zustand';

import { User } from '@/db/schema';

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  resetUser: () => void;
}

export const useUser = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: null }),
}));
