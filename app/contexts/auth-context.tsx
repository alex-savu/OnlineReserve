import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createClient } from "@supabase/supabase-js";
import { projectId, publicAnonKey } from "/utils/supabase/info";
import type { UserRole } from "@/app/types";

interface User {
  id: string;
  email: string;
  user_metadata: {
    name?: string;
    avatar_url?: string;
    phone?: string;
    role?: UserRole;
    assignedHostelId?: string;
  };
}

interface AuthContextType {
  user: User | null;
  session: any | null;
  loading: boolean;
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithProvider: (provider: "google" | "facebook" | "apple") => Promise<void>;
  signOut: () => Promise<void>;
  getAccessToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const supabase = createClient(
  `https://${projectId}.supabase.co`,
  publicAnonKey
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Save access token to localStorage for chat functionality
      if (session?.access_token) {
        localStorage.setItem("accessToken", session.access_token);
        setAccessToken(session.access_token);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Save access token to localStorage for chat functionality
      if (session?.access_token) {
        localStorage.setItem("accessToken", session.access_token);
        setAccessToken(session.access_token);
      } else {
        localStorage.removeItem("accessToken");
        setAccessToken(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    
    setSession(data.session);
    setUser(data.user);
    
    // Save access token to localStorage for chat functionality
    if (data.session?.access_token) {
      localStorage.setItem("accessToken", data.session.access_token);
      setAccessToken(data.session.access_token);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    // Call backend to create user
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-c7f3f823/auth/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${publicAnonKey}`,
        },
        body: JSON.stringify({ email, password, name }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Eroare la înregistrare");
    }

    // Now sign in
    await signIn(email, password);
  };

  const signInWithProvider = async (provider: "google" | "facebook" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setSession(null);
    
    // Remove access token from localStorage
    localStorage.removeItem("accessToken");
    setAccessToken(null);
  };

  const getAccessToken = () => {
    return session?.access_token ?? null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        accessToken,
        signIn,
        signUp,
        signInWithProvider,
        signOut,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}