import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { fetchProfile } from '../api';
import type { UserProfile } from '../api';

export type UserId = 'u1' | 'u2';

interface UserContextType {
  userId: UserId;
  setUserId: (id: UserId) => void;
  profile: UserProfile | null;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<UserId>('u2');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchProfile(userId)
      .then((data) => {
        if (isMounted) setProfile(data);
      })
      .catch((err) => {
        console.error('Error fetching profile', err);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId, profile, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
