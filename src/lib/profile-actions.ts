'use server';

import { serverAuth } from './auth';
import { storage, STORAGE_BUCKETS } from './storage';
import { createClient } from './supabase/server';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
  language?: string;
  timezone?: string;
  email_notifications?: boolean;
}

export interface PasswordChangeData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface AvatarUploadData {
  file: File;
}

export async function updateProfileAction(data: ProfileUpdateData) {
  try {
    const { data: authData, error: authError } = await serverAuth.getCurrentUser();
    
    if (authError || !authData?.user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Update profile in database
    const supabase = await createClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id);

    if (updateError) {
      console.error('Profile update error:', updateError);
      return {
        success: false,
        error: 'Failed to update profile. Please try again.',
      };
    }

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Profile updated successfully!',
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function uploadAvatarAction(formData: FormData) {
  try {
    const { data: authData, error: authError } = await serverAuth.getCurrentUser();
    
    if (authError || !authData?.user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    const file = formData.get('avatar') as File;
    
    if (!file) {
      return {
        success: false,
        error: 'No file selected',
      };
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Please select an image file',
      };
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File size must be less than 5MB',
      };
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop();
    const fileName = `${authData.user.id}-${Date.now()}.${fileExtension}`;
    const filePath = `avatars/${fileName}`;

    // Upload to Supabase Storage
    const uploadResult = await storage.uploadFile(
      STORAGE_BUCKETS.AVATARS,
      filePath,
      file,
      { upsert: true }
    );

    if (uploadResult.error) {
      return {
        success: false,
        error: `Upload failed: ${uploadResult.error.message}`,
      };
    }

    // Update profile with new avatar URL
    const supabase = await createClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: uploadResult.data!.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id);

    if (updateError) {
      return {
        success: false,
        error: 'Failed to update profile with new avatar',
      };
    }

    revalidatePath('/dashboard/profile');
    revalidatePath('/dashboard');

    return {
      success: true,
      message: 'Avatar updated successfully!',
      data: {
        avatar_url: uploadResult.data!.url,
      },
    };
  } catch (error) {
    console.error('Avatar upload error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function changePasswordAction(data: PasswordChangeData) {
  try {
    const { data: authData, error: authError } = await serverAuth.getCurrentUser();
    
    if (authError || !authData?.user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Validate new password
    if (data.new_password.length < 8) {
      return {
        success: false,
        error: 'New password must be at least 8 characters long.',
      };
    }

    if (data.new_password !== data.confirm_password) {
      return {
        success: false,
        error: 'New passwords do not match.',
      };
    }

    // Check if password contains at least one number and one letter
    const hasNumber = /\d/.test(data.new_password);
    const hasLetter = /[a-zA-Z]/.test(data.new_password);
    
    if (!hasNumber || !hasLetter) {
      return {
        success: false,
        error: 'Password must contain at least one letter and one number.',
      };
    }

    // Change password using Supabase Auth
    const supabase = await createClient();
    const { error: passwordError } = await supabase.auth.updateUser({
      password: data.new_password,
    });

    if (passwordError) {
      return {
        success: false,
        error: passwordError.message,
      };
    }

    revalidatePath('/dashboard/profile');

    return {
      success: true,
      message: 'Password changed successfully!',
    };
  } catch (error) {
    console.error('Password change error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function deleteAccountAction() {
  try {
    const { data: authData, error: authError } = await serverAuth.getCurrentUser();
    
    if (authError || !authData?.user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Soft delete profile
    const supabase = await createClient();
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        account_status: 'deleted',
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('Profile deletion error:', profileError);
      return {
        success: false,
        error: 'Failed to delete profile. Please try again.',
      };
    }

    // Delete user from Supabase Auth (this requires admin privileges)
    // For now, we'll just soft delete the profile
    // In production, you might want to use a webhook or admin function
    console.log('Profile soft deleted. User account deletion requires admin privileges.');

    revalidatePath('/dashboard');
    
    // Redirect to home page
    redirect('/');

  } catch (error) {
    console.error('Account deletion error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}

export async function getProfileAction() {
  try {
    const { data: authData, error: authError } = await serverAuth.getCurrentUser();
    
    if (authError || !authData?.user) {
      return {
        success: false,
        error: 'Authentication required',
      };
    }

    // Get profile data
    const supabase = await createClient();
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
      return {
        success: false,
        error: 'Failed to fetch profile data',
      };
    }

    return {
      success: true,
      data: profile,
    };
  } catch (error) {
    console.error('Profile fetch error:', error);
    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
    };
  }
}
