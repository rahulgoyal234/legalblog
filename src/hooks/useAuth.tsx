import { useState, useEffect, createContext, useContext } from 'react';
import { UserProfile, subscribeToAuthChanges, logout as authLogout, loginWithGoogle, loginWithEmail } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  loginEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return subscribeToAuthChanges((userProfile) => {
      setUser(userProfile);
      setLoading(false);
    });
  }, []);

  const login = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
    }
  };

  const loginEmail = async (email: string, pass: string) => {
    await loginWithEmail(email, pass);
  };

  const logout = async () => {
    try {
      await authLogout();
    } catch (error) {
      console.error(error);
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, loginEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
