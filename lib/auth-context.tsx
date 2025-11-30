// lib/auth-context.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  setUser: (user: any | null) => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);



export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Option : hydrater depuis cookie / token / /api/me
    setLoading(false);
  }, []);

  useEffect(() => {
  // Vérifier si l'utilisateur était connecté précédemment
  const savedUser = localStorage.getItem('user');
  const token = localStorage.getItem('auth-token');
  
  if (savedUser && token) {
    try {
      setUser(JSON.parse(savedUser));
    } catch (error) {
      console.error('Erreur parsing user data:', error);
      localStorage.removeItem('user');
      localStorage.removeItem('auth-token');
    }
  }
  
  setLoading(false);
}, []);

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth-token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, setUser, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
