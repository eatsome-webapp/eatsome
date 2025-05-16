'use client';

import { createBrowserClient } from '@supabase/ssr';
import { ThemeProvider } from 'next-themes';
import { createContext, useContext, useEffect, useState } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  User as SupabaseUser, 
  Session, 
  AuthError, 
  AuthTokenResponse, 
  AuthTokenResponsePassword,
  UserMetadata,
  UserAppMetadata
} from '@supabase/supabase-js';

// Temporary types until we generate the real ones
type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          user_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// Types
// Make all fields optional to handle partial user objects from Supabase
type User = {
  id: string;
  email?: string | null;
  created_at?: string;
  updated_at?: string;
  user_metadata?: UserMetadata | null;
  app_metadata?: UserAppMetadata | null;
  aud?: string;
  confirmed_at?: string | null;
  email_confirmed_at?: string | null;
  last_sign_in_at?: string | null;
  phone?: string | null;
  role?: string | null;
  // Additional fields from Supabase
  identities?: any[];
  factors?: any[];
  is_anonymous?: boolean;
  // Index signature for any other potential fields
  [key: string]: any;
};

type Profile = {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  [key: string]: any; // For any additional fields
};

// Auth store with Zustand
interface AuthState {
  email: string;
  rememberMe: boolean;
  setEmail: (email: string) => void;
  setRememberMe: (remember: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      email: '',
      rememberMe: false,
      setEmail: (email: string) => set({ email }),
      setRememberMe: (remember: boolean) => set({ rememberMe: remember }),
      reset: () => set({ email: '', rememberMe: false }),
    }),
    {
      name: 'eatsome-auth-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Auth context for server components
type AuthResponse = {
  error: Error | null;
  data: { 
    user: User | null; 
    session: Session | null;
  } | null;
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  signInWithPassword: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (email: string, password: string) => Promise<AuthResponse>;
  error: Error | null;
  session: Session | null;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  signInWithPassword: async () => ({ error: null, data: null }),
  signUp: async () => ({ error: null, data: null }),
  error: null,
  session: null,
});

interface ClientProvidersProps {
  children: React.ReactElement;
  serverUser?: User | null;
  serverProfile?: Profile | null;
}

export default function ClientProviders({
  children,
  serverUser = null,
  serverProfile = null,
}: ClientProvidersProps) {
  const [supabase] = useState(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error('Missing Supabase environment variables');
    }
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
  });
  
  const [user, setUser] = useState<User | null>(serverUser);
  const [profile, setProfile] = useState<Profile | null>(serverProfile);
  const [isLoading, setIsLoading] = useState(!serverUser);
  const authStore = useAuthStore();

  // Handle auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const userData = session.user as User;
          setUser(userData);
          
          // Fetch user profile
          try {
            const { data: profileData, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('user_id', userData.id)
              .single();
              
            if (!error && profileData) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Error fetching profile:', error);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase]);

  // Synchronize server state with client state on mount
  useEffect(() => {
    if (serverUser?.email) {
      authStore.setEmail(serverUser.email);
    }
  }, [serverUser, authStore]);

  // Auth methods
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithPassword = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        return { error, data: null };
      }
      
      // Safely map the Supabase user to our User type
      const userData = data?.user;
      const user: User | null = userData ? {
        id: userData.id,
        email: userData.email || undefined,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        user_metadata: userData.user_metadata || null,
        app_metadata: userData.app_metadata || null,
        // Include other fields from Supabase user
        ...Object.fromEntries(
          Object.entries(userData)
            .filter(([key]) => !['id', 'email', 'created_at', 'updated_at', 'user_metadata', 'app_metadata'].includes(key))
        )
      } : null;
      
      return { 
        error: null, 
        data: { 
          user,
          session: data.session
        } 
      };
    } catch (error) {
      console.error('Sign in error:', error);
      return { 
        error: error instanceof Error ? error : new Error('An unknown error occurred'), 
        data: null 
      };
    }
  };

  const signUp = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) {
        return { error, data: null };
      }
      
      // Safely map the Supabase user to our User type
      const userData = data?.user;
      const user: User | null = userData ? {
        id: userData.id,
        email: userData.email || undefined,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        user_metadata: userData.user_metadata || null,
        app_metadata: userData.app_metadata || null,
        // Include other fields from Supabase user
        ...Object.fromEntries(
          Object.entries(userData)
            .filter(([key]) => !['id', 'email', 'created_at', 'updated_at', 'user_metadata', 'app_metadata'].includes(key))
        )
      } : null;
      
      return { 
        error: null, 
        data: { 
          user,
          session: data.session
        } 
      };
    } catch (error) {
      console.error('Sign up error:', error);
      return { 
        error: error instanceof Error ? error : new Error('An unknown error occurred'), 
        data: null 
      };
    }
  };

  const contextValue = {
    user,
    profile,
    isLoading,
    signOut,
    signInWithPassword,
    signUp,
    error: null,
    session: null,
  };

  // Create a proper React element with children
  const Provider = AuthContext.Provider as unknown as React.FC<{ value: AuthContextType; children: React.ReactNode }>;

  return (
    <Provider value={contextValue}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </Provider>
  );
}

// Hook for accessing auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
