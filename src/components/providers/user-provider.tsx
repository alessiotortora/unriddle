'use client';

import { useEffect } from 'react';

import { users } from '@/db/schema';
import { useUser } from '@/hooks/use-user';

// Updated to reflect the Zustand store location

interface UserProviderProps {
  initialUser: users | null;
  children: React.ReactNode;
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const { setUser, resetUser } = useUser();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser); // Set user in Zustand
    } else {
      resetUser(); // Reset user if initialUser is null
    }
  }, [initialUser, setUser, resetUser]);

  return <>{children}</>;
}

export default UserProvider;
