import { supabase } from './supabase/client';
import { createClient } from './supabase/server';
import { Profile } from '@/types';
import type { User, Session } from '@supabase/supabase-js';

export interface AuthError {
  message: string;
  status?: number;
}

export interface AuthResult<T> {
  data: T | null;
  error: AuthError | null;
}

// Client-side authentication functions
export const auth = {
  // Sign up with email and password
  async signUp(
    email: string,
    password: string,
    profile?: Partial<Profile>
  ): Promise<AuthResult<{ user: User; profile: Profile | null }>> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profile,
        },
      });

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      // Create profile if signup successful
      if (data.user && !data.user.user_metadata?.profile_created) {
        const profileResult = await this.createProfile(data.user.id, {
          email,
          ...profile,
        });

        if (profileResult.error) {
          console.warn('Profile creation failed:', profileResult.error);
        }
      }

      return {
        data: {
          user: data.user!,
          profile: null,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Sign in with email and password
  async signIn(
    email: string,
    password: string
  ): Promise<AuthResult<{ user: User; profile: Profile | null }>> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      // Fetch user profile
      const profile = await this.getProfile(data.user.id);

      return {
        data: {
          user: data.user,
          profile: profile.data,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Sign out
  async signOut(): Promise<AuthResult<void>> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data: undefined, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Get current user
  async getCurrentUser(): Promise<
    AuthResult<{ user: User; profile: Profile | null }>
  > {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return {
          data: null,
          error: { message: error?.message || 'No user found' },
        };
      }

      // Fetch user profile
      const profile = await this.getProfile(user.id);

      return {
        data: {
          user,
          profile: profile.data,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Get user profile
  async getProfile(userId: string): Promise<AuthResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Create user profile
  async createProfile(
    userId: string,
    profileData: Partial<Profile>
  ): Promise<AuthResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            ...profileData,
            account_status: 'active',
            language: 'en-PH',
            timezone: 'Asia/Manila',
            email_notifications: true,
          },
        ])
        .select()
        .single();

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Update user profile
  async updateProfile(
    userId: string,
    updates: Partial<Profile>
  ): Promise<AuthResult<Profile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Reset password
  async resetPassword(email: string): Promise<AuthResult<void>> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
      });

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data: undefined, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Update password
  async updatePassword(newPassword: string): Promise<AuthResult<void>> {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data: undefined, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },
};

// Server-side authentication functions
export const serverAuth = {
  // Get current user on server side
  async getCurrentUser(): Promise<
    AuthResult<{ user: User; profile: Profile | null }>
  > {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        return {
          data: null,
          error: { message: error?.message || 'No user found' },
        };
      }

      // Fetch user profile
      const profile = await this.getProfile(user.id);

      return {
        data: {
          user,
          profile: profile.data,
        },
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },

  // Get user profile on server side
  async getProfile(userId: string): Promise<AuthResult<Profile>> {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { data: null, error: { message: error.message } };
      }

      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: {
          message:
            error instanceof Error
              ? error.message
              : 'An unexpected error occurred',
        },
      };
    }
  },
};

// Auth state change listener
export const onAuthStateChange = (
  callback: (event: string, session: Session | null) => void
) => {
  return supabase.auth.onAuthStateChange(callback);
};

// Get current session
export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();
  return { session, error };
};
