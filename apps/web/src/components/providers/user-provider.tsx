'use client';

import { memo, useEffect } from 'react';

import { User } from '@/db/schema';
import { useUser } from '@/hooks/use-user';

interface UserProviderProps {
  initialUser: User | null;
  children: React.ReactNode;
}

function UserProviderComponent({ children, initialUser }: UserProviderProps) {
  const { setUser, resetUser, user } = useUser();

  // Only update user state if it actually changed
  useEffect(() => {
    const currentUserJson = JSON.stringify(user);
    const initialUserJson = JSON.stringify(initialUser);

    if (currentUserJson !== initialUserJson) {
  
      if (initialUser) {
        setUser(initialUser);
      } else {
        resetUser();
      }
    }
  }, [initialUser, setUser, resetUser, user]);

  return children;
}

// Memoize the component to prevent unnecessary re-renders
export const UserProvider = memo(UserProviderComponent);

export default UserProvider;
