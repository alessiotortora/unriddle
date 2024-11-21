'use client';

import { useEffect } from 'react';

import { User } from '@/db/schema';
import { useUser } from '@/hooks/use-user';

interface UserProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

export function UserProvider({ children, initialUser }: UserProviderProps) {
  const { setUser, resetUser } = useUser();

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else {
      resetUser();
    }
  }, [initialUser]);

  return <>{children}</>;
}

export default UserProvider;
