import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { auth, onAuthStateChange, getSession } from '@/lib/auth';
import { Profile } from '@/types';

export interface AuthUser {
  user: User | null;
  profile: Profile | null;
}

export function useAuth() {
  const [authUser, setAuthUser] = useState<AuthUser>({ user: null, profile: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { session } = await getSession();
      
      if (session?.user) {
        const profile = await auth.getProfile(session.user.id);
        setAuthUser({
          user: session.user,
          profile: profile.data,
        });
      }
      
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await auth.getProfile(session.user.id);
        setAuthUser({
          user: session.user,
          profile: profile.data,
        });
      } else {
        setAuthUser({ user: null, profile: null });
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const result = await auth.signIn(email, password);
    if (result.data) {
      setAuthUser({
        user: result.data.user,
        profile: result.data.profile,
      });
    }
    return { error: result.error };
  };

  const signUp = async (email: string, password: string, profile?: Partial<Profile>) => {
    const result = await auth.signUp(email, password, profile);
    if (result.data) {
      setAuthUser({
        user: result.data.user,
        profile: result.data.profile,
      });
    }
    return { error: result.error };
  };

  const signOut = async () => {
    const result = await auth.signOut();
    if (!result.error) {
      setAuthUser({ user: null, profile: null });
    }
    return { error: result.error };
  };

  const resetPassword = async (email: string) => {
    return await auth.resetPassword(email);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!authUser.user) {
      return { error: { message: 'No user logged in' } };
    }
    
    const result = await auth.updateProfile(authUser.user.id, updates);
    if (result.data) {
      setAuthUser(prev => ({
        ...prev,
        profile: result.data,
      }));
    }
    return result;
  };

  const refreshProfile = async () => {
    if (!authUser.user) {
      return { error: { message: 'No user logged in' } };
    }
    
    const result = await auth.getProfile(authUser.user.id);
    if (result.data) {
      setAuthUser(prev => ({
        ...prev,
        profile: result.data,
      }));
    }
    return result;
  };

  return {
    user: authUser.user,
    profile: authUser.profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshProfile,
  };
}
