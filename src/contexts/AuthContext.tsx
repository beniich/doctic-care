// contexts/AuthContext.tsx — Contexte d'authentification global Doctic-Care (Version API + Hooks)
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi, type User } from '@/lib/api';

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

// ─── CONTEXT ──────────────────────────────────────────────────────────────────
const AuthContext = createContext<AuthContextValue & { showSplash: boolean }>({
  user: null,
  loading: true,
  isAuthenticated: false,
  showSplash: false,
  login: async () => ({ success: false }),
  logout: async () => {},
  refresh: async () => {},
});

// ─── PROVIDER ─────────────────────────────────────────────────────────────────
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  
  // Utiliser hook conditionnel si à l'avenir on veut que AuthProvider soit très haut (avant Router)
  // On laisse navigate géré dans les composants qui en ont besoin, ou on le passe ici.
  // Pour la flexibilité (Auth en dehors du Router), on injecte le comportement
  
  const refresh = useCallback(async () => {
    try {
      const res = await authApi.me();
      setUser(res.data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    try {
      const res = await authApi.login(email, password);
      // Wow Factor: Active le splash screen
      setShowSplash(true);
      setUser(res.data.user);
      
      // On garde le splash 1.8s pour l'effet "Wow"
      setTimeout(() => {
        setShowSplash(false);
      }, 1800);

      return { success: true };
    } catch (err: unknown) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Connexion échouée',
      };
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      window.location.href = '/login'; // Plus sûr si AuthProvider est au dessus du Router
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      showSplash,
      login,
      logout,
      refresh,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── HOOK ─────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

// ─── HOC PROTECT ROUTE ────────────────────────────────────────────────────────
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredRole?: User['role']
) {
  return function ProtectedComponent(props: P) {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !user) {
        navigate('/login');
      }
    }, [user, loading, navigate]);

    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-background">
          <div className="text-secondary text-sm">Chargement...</div>
        </div>
      );
    }

    if (!user) {
      return null;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== 'SUPER_ADMIN') {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-4">
          <div className="text-5xl">🚫</div>
          <div className="text-danger font-bold text-xl">Accès refusé</div>
          <div className="text-secondary text-sm">Droits insuffisants pour accéder à cette page.</div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
