import { createContext, useContext, useState, ReactNode } from 'react';

export type UserType = 'normal' | 'admin';

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [userType, setUserType] = useState<UserType>('admin'); // Iniciando como admin

  return (
    <UserContext.Provider value={{
      userType,
      setUserType,
      isAdmin: userType === 'admin'
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}