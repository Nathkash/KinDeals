import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  isSeller: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  toggleSellerMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulation d'une authentification
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: '1',
        name: 'John Doe',
        email,
        phone: '+243 900 000 000',
        isSeller: false,
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id'> & { password: string }): Promise<boolean> => {
    // Simulation d'une inscription
    if (userData.email && userData.password.length >= 6) {
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        isSeller: userData.isSeller,
      };
      setUser(newUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const toggleSellerMode = () => {
    if (user) {
      setUser({ ...user, isSeller: !user.isSeller });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, toggleSellerMode }}>
      {children}
    </AuthContext.Provider>
  );
};