import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase, getSupabaseConfig } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  isDemoMode: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  loginAsDemo: (rememberMe?: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  app_metadata: { provider: 'email' },
  user_metadata: { full_name: 'Musfiq Russell' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'musfiqrussell@gmail.com',
  role: 'authenticated',
} as User;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    const config = getSupabaseConfig();
    setIsConfigured(config.isConfigured);

    // Check if user previously logged in as demo (localStorage for Remember Me, or sessionStorage for temporary session)
    const savedDemoLocal = localStorage.getItem('portfolio_admin_demo_session');
    const savedDemoSession = sessionStorage.getItem('portfolio_admin_demo_session');
    if (savedDemoLocal === 'true' || savedDemoSession === 'true') {
      setIsDemoMode(true);
      setUser(DEMO_USER);
      setLoading(false);
      return;
    }

    // Check real Supabase session if configured
    if (config.isConfigured) {
      supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
        setSession(existingSession);
        setUser(existingSession?.user ?? null);
        setLoading(false);
      }).catch((err) => {
        console.warn('Supabase auth session error:', err);
        setLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(false);
      });

      return () => {
        subscription.unsubscribe();
      };
    } else {
      setLoading(false);
    }
  }, []);

  const signIn = async (email: string, password: string, rememberMe: boolean = true) => {
    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { error };
        setUser(data.user);
        setSession(data.session);
        setIsDemoMode(false);
        localStorage.removeItem('portfolio_admin_demo_session');
        sessionStorage.removeItem('portfolio_admin_demo_session');
        if (rememberMe) {
          localStorage.setItem('portfolio_remember_me', 'true');
        } else {
          localStorage.setItem('portfolio_remember_me', 'false');
        }
        return { error: null };
      } catch (err: any) {
        return { error: err };
      }
    } else {
      // Fallback for demo when Supabase credentials aren't linked yet
      if (password.length >= 4) {
        loginAsDemo(rememberMe);
        return { error: null };
      }
      return { error: new Error('Password must be at least 4 characters long in demo mode.') };
    }
  };

  const signOut = async () => {
    const config = getSupabaseConfig();
    if (config.isConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.removeItem('portfolio_admin_demo_session');
    sessionStorage.removeItem('portfolio_admin_demo_session');
    setIsDemoMode(false);
    setUser(null);
    setSession(null);
  };

  const loginAsDemo = (rememberMe: boolean = true) => {
    setIsDemoMode(true);
    setUser(DEMO_USER);
    if (rememberMe) {
      localStorage.setItem('portfolio_admin_demo_session', 'true');
      localStorage.setItem('portfolio_remember_me', 'true');
    } else {
      sessionStorage.setItem('portfolio_admin_demo_session', 'true');
      localStorage.removeItem('portfolio_admin_demo_session');
      localStorage.setItem('portfolio_remember_me', 'false');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured,
        isDemoMode,
        signIn,
        signOut,
        loginAsDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
