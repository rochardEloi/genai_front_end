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
    const initAuth = async () => {
      try {
        // Vérifier si l'utilisateur était connecté précédemment via localStorage
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
        
        // Vérifier aussi via l'API /api/verify pour valider le cookie de session
        const response = await fetch('/api/verify', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setUser(data.user);
            // Sauvegarder dans localStorage pour les prochains rechargements
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      } catch (error) {
        console.error('Erreur vérification auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
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
