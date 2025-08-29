'use server';

import { auth, serverAuth } from './auth';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  terms_accepted: boolean;
  marketing_consent?: boolean;
}

export interface SignInData {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface ResetPasswordData {
  email: string;
}

export interface UpdatePasswordData {
  password: string;
  confirm_password: string;
}

export async function signUpAction(data: SignUpData) {
  try {
    // Validate required fields
    if (!data.email || !data.password || !data.full_name || !data.terms_accepted) {
      return {
        success: false,
        error: 'Please fill in all required fields and accept the terms.',
      };
    }

    // Validate password strength
    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long.',
      };
    }

    // Check if password contains at least one number and one letter
    const hasNumber = /\d/.test(data.password);
    const hasLetter = /[a-zA-Z]/.test(data.password);
    
    if (!hasNumber || !hasLetter) {
      return {
        success: false,
        error: 'Password must contain at least one letter and one number.',
      };
    }

    // Create profile data
    const profileData = {
      full_name: data.full_name,
      phone: data.phone,
      email_notifications: data.marketing_consent || false,
    };

    // Attempt to sign up
    const result = await auth.signUp(data.email, data.password, profileData);

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      };
    }

    if (result.data?.user) {
      // Revalidate auth-related paths
      revalidatePath('/auth');
      revalidatePath('/dashboard');
      
      return {
        success: true,
        message: 'Account created successfully! Please check your email to verify your account.',
        user: result.data.user,
      };
    }

    return {
      success: false,
      error: 'Failed to create account. Please try again.',
    };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function signInAction(data: SignInData) {
  try {
    // Validate required fields
    if (!data.email || !data.password) {
      return {
        success: false,
        error: 'Please enter your email and password.',
      };
    }

    // Attempt to sign in
    const result = await auth.signIn(data.email, data.password);

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      };
    }

    if (result.data?.user) {
      // Revalidate auth-related paths
      revalidatePath('/auth');
      revalidatePath('/dashboard');
      
      return {
        success: true,
        message: 'Signed in successfully!',
        user: result.data.user,
        profile: result.data.profile,
      };
    }

    return {
      success: false,
      error: 'Invalid email or password.',
    };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function signOutAction() {
  try {
    const result = await auth.signOut();
    
    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      };
    }

    // Revalidate auth-related paths
    revalidatePath('/auth');
    revalidatePath('/dashboard');
    
    return {
      success: true,
      message: 'Signed out successfully!',
    };
  } catch (error) {
    console.error('Sign out error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function resetPasswordAction(data: ResetPasswordData) {
  try {
    // Validate email
    if (!data.email) {
      return {
        success: false,
        error: 'Please enter your email address.',
      };
    }

    // Attempt to reset password
    const result = await auth.resetPassword(data.email);

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      message: 'Password reset email sent! Please check your inbox and follow the instructions.',
    };
  } catch (error) {
    console.error('Reset password error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function updatePasswordAction(data: UpdatePasswordData) {
  try {
    // Validate passwords
    if (!data.password || !data.confirm_password) {
      return {
        success: false,
        error: 'Please enter both password fields.',
      };
    }

    if (data.password !== data.confirm_password) {
      return {
        success: false,
        error: 'Passwords do not match.',
      };
    }

    if (data.password.length < 8) {
      return {
        success: false,
        error: 'Password must be at least 8 characters long.',
      };
    }

    // Check password strength
    const hasNumber = /\d/.test(data.password);
    const hasLetter = /[a-zA-Z]/.test(data.password);
    
    if (!hasNumber || !hasLetter) {
      return {
        success: false,
        error: 'Password must contain at least one letter and one number.',
      };
    }

    // Attempt to update password
    const result = await auth.updatePassword(data.password);

    if (result.error) {
      return {
        success: false,
        error: result.error.message,
      };
    }

    return {
      success: true,
      message: 'Password updated successfully!',
    };
  } catch (error) {
    console.error('Update password error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function getCurrentUserAction() {
  try {
    const result = await serverAuth.getCurrentUser();
    
    if (result.error) {
      return {
        success: false,
        error: result.error.message,
        user: null,
        profile: null,
      };
    }

    return {
      success: true,
      user: result.data?.user || null,
      profile: result.data?.profile || null,
    };
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred.',
      user: null,
      profile: null,
    };
  }
}

export async function requireAuth() {
  const userResult = await getCurrentUserAction();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth/signin');
  }
  
  return userResult;
}
