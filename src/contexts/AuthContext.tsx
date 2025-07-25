import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextData {
  isAuthenticated: boolean;
  user: any | null;
  loading: boolean;
  signIn: (credentials: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData(): Promise<void> {
    try {
      const storedUser = await AsyncStorage.getItem('@AgriTrace:user');
      const storedToken = await AsyncStorage.getItem('@AgriTrace:token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Error loading storage data:', error);
    } finally {
      setLoading(false);
    }
  }

  const signIn = async (credentials: { email: string; password: string }) => {
    try {
      // Implement your sign in logic here
      // Example:
      // const response = await api.post('/auth/login', credentials);
      // const { user, token } = response.data;
      
      // For demo purposes:
      const mockUser = { id: 1, email: credentials.email, name: 'Test User' };
      const mockToken = 'mock-token';

      await AsyncStorage.setItem('@AgriTrace:user', JSON.stringify(mockUser));
      await AsyncStorage.setItem('@AgriTrace:token', mockToken);

      setUser(mockUser);
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('@AgriTrace:user');
      await AsyncStorage.removeItem('@AgriTrace:token');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
} 