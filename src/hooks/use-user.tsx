import { InferModel } from 'drizzle-orm';
import { create } from 'zustand';

import { users } from '@/db/schema';

// Infer the user type from Drizzle schema
type User = InferModel<typeof users>;

interface UserState {
  user: User | null; // Represents the current user state
  setUser: (user: User | null) => void; // Function to set user state
  resetUser: () => void; // Function to reset user state
}

// Zustand store for managing user state
export const useUser = create<UserState>((set) => ({
  user: null, // Initial state
  setUser: (user) => set({ user }), // Update user state
  resetUser: () => set({ user: null }), // Reset user to null
}));
