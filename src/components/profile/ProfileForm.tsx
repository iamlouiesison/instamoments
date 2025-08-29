'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { updateProfileAction, uploadAvatarAction, changePasswordAction, deleteAccountAction, getProfileAction } from '@/lib/profile-actions';
import { ProfileUpdateData, PasswordChangeData } from '@/lib/profile-actions';
import { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileFormProps {
  initialProfile?: Profile;
}

export default function ProfileForm({ initialProfile }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isPasswordPending, setIsPasswordPending] = useTransition();
  const [isAvatarPending, setIsAvatarPending] = useTransition();
  const [isDeletePending, setIsDeletePending] = useTransition();
  
  const [profile, setProfile] = useState<ProfileUpdateData>({
    full_name: initialProfile?.full_name || '',
    phone: initialProfile?.phone || '',
    language: initialProfile?.language || 'en-PH',
    timezone: initialProfile?.timezone || 'Asia/Manila',
    email_notifications: initialProfile?.email_notifications ?? true,
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Language options
  const languageOptions = [
    { value: 'en-PH', label: 'English (Philippines)' },
    { value: 'tl-PH', label: 'Tagalog (Philippines)' },
    { value: 'ceb-PH', label: 'Cebuano (Philippines)' },
  ];

  // Timezone options (Philippine timezones)
  const timezoneOptions = [
    { value: 'Asia/Manila', label: 'Philippines (UTC+8)' },
  ];

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    startTransition(async () => {
      const result = await updateProfileAction(profile);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message! });
        // Refresh profile data
        const profileResult = await getProfileAction();
        if (profileResult.success && profileResult.data) {
          setProfile({
            full_name: profileResult.data.full_name || '',
            phone: profileResult.data.phone || '',
            language: profileResult.data.language || 'en-PH',
            timezone: profileResult.data.timezone || 'Asia/Manila',
            email_notifications: profileResult.data.email_notifications ?? true,
          });
        }
      } else {
        setMessage({ type: 'error', text: result.error! });
      }
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAvatarPending(async () => {
      const formData = new FormData();
      formData.append('avatar', file);

      const result = await uploadAvatarAction(formData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message! });
        // Refresh the page to show new avatar
        router.refresh();
      } else {
        setMessage({ type: 'error', text: result.error! });
      }
    });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    setIsPasswordPending(async () => {
      const result = await changePasswordAction(passwordData);
      
      if (result.success) {
        setMessage({ type: 'success', text: result.message! });
        setShowPasswordDialog(false);
        setPasswordData({
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      } else {
        setMessage({ type: 'error', text: result.error! });
      }
    });
  };

  const handleAccountDeletion = async () => {
    setIsDeletePending(async () => {
      const result = await deleteAccountAction();
      
      if (result.success) {
        // Redirect will happen automatically
        return;
      } else {
        setMessage({ type: 'error', text: result.error! });
        setShowDeleteDialog(false);
      }
    });
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Success/Error Messages */}
      {message && (
        <div className={`p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile Information Card */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal information and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={initialProfile?.avatar_url} 
                    alt={profile.full_name || 'User avatar'} 
                  />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-center space-y-2">
                  <label htmlFor="avatar-upload" className="cursor-pointer">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={isAvatarPending}
                    >
                      {isAvatarPending ? 'Uploading...' : 'Change Avatar'}
                    </Button>
                  </label>
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                    disabled={isAvatarPending}
                  />
                  <p className="text-xs text-gray-500">
                    Max 5MB, JPG, PNG, GIF
                  </p>
                </div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <Input
                      id="full_name"
                      type="text"
                      value={profile.full_name}
                      onChange={(e) => setProfile(prev => ({ ...prev, full_name: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                      Language
                    </label>
                    <select
                      id="language"
                      value={profile.language}
                      onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      {languageOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="timezone" className="block text-sm font-medium text-gray-700 mb-1">
                      Timezone
                    </label>
                    <select
                      id="timezone"
                      value={profile.timezone}
                      onChange={(e) => setProfile(prev => ({ ...prev, timezone: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    >
                      {timezoneOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    id="email_notifications"
                    type="checkbox"
                    checked={profile.email_notifications}
                    onChange={(e) => setProfile(prev => ({ ...prev, email_notifications: e.target.checked }))}
                    className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email_notifications" className="text-sm text-gray-700">
                    Receive email notifications about events and updates
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-amber-600 hover:bg-amber-700"
              >
                {isPending ? 'Updating...' : 'Update Profile'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your password to keep your account secure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                Change Password
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Password</DialogTitle>
                <DialogDescription>
                  Enter your current password and choose a new one
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div>
                  <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <Input
                    id="current_password"
                    type="password"
                    value={passwordData.current_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                    placeholder="Enter current password"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <Input
                    id="new_password"
                    type="password"
                    value={passwordData.new_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                    placeholder="Enter new password"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Must be at least 8 characters with letters and numbers
                  </p>
                </div>
                
                <div>
                  <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <Input
                    id="confirm_password"
                    type="password"
                    value={passwordData.confirm_password}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                    placeholder="Confirm new password"
                    required
                  />
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowPasswordDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={isPasswordPending}
                    className="bg-amber-600 hover:bg-amber-700"
                  >
                    {isPasswordPending ? 'Changing...' : 'Change Password'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Account Deletion Card */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Danger Zone</CardTitle>
          <CardDescription className="text-red-600">
            Irreversible and destructive actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-red-800">Delete Account</h4>
              <p className="text-sm text-red-600 mt-1">
                Permanently delete your account and all associated data
              </p>
            </div>
            
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogTrigger asChild>
                <Button variant="destructive">
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-medium text-red-800 mb-2">What will be deleted:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Your profile information</li>
                    <li>• All events you&apos;ve created</li>
                    <li>• All photos and videos</li>
                    <li>• Account settings and preferences</li>
                  </ul>
                </div>
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="button" 
                    variant="destructive"
                    onClick={handleAccountDeletion}
                    disabled={isDeletePending}
                  >
                    {isDeletePending ? 'Deleting...' : 'Yes, Delete My Account'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
