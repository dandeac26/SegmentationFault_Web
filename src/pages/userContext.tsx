// UserContext.tsx
import { createContext, useState } from 'react';

export type User = {
  id: string;
  email: string;
  role: string;
};

export type UserContextType = {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
};

// Provide initial context value
const initialUserContextValue: UserContextType = {
  currentUser: null,
  setCurrentUser: () => {},
};
type UserProviderProps = {
  children: React.ReactNode;
};

export const UserContext = createContext<UserContextType | null>(initialUserContextValue);

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Always provide a value
  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </UserContext.Provider>
  );
};
