import { Suspense } from 'react';
import { getProfileAction } from '@/lib/profile-actions';
import ProfileForm from '@/components/profile/ProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Breadcrumb } from '@/components/ui/breadcrumb';

export default async function ProfilePage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Breadcrumb 
          items={[
            { label: 'Dashboard', href: '/dashboard' },
            { label: 'Profile Settings' }
          ]} 
        />
      </div>
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile Settings</h1>
        <p className="text-gray-600">
          Manage your account information, preferences, and security settings
        </p>
      </div>

      <Suspense fallback={<ProfileLoadingSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  );
}

async function ProfileContent() {
  const profileResult = await getProfileAction();

  if (!profileResult.success) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-800">Error Loading Profile</CardTitle>
          <CardDescription className="text-red-600">
            {profileResult.error}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-700">
            Please try refreshing the page or contact support if the problem persists.
          </p>
        </CardContent>
      </Card>
    );
  }

  return <ProfileForm initialProfile={profileResult.data} />;
}

function ProfileLoadingSkeleton() {
  return (
    <div className="space-y-6">
      {/* Profile Information Card Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Avatar Section Skeleton */}
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-center space-y-2">
                <div className="h-20 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
                <div className="h-3 bg-gray-200 rounded w-20"></div>
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <div className="h-10 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Card Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-80"></div>
        </CardHeader>
        <CardContent>
          <div className="h-10 bg-gray-200 rounded w-36"></div>
        </CardContent>
      </Card>

      {/* Account Deletion Card Skeleton */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <div className="h-6 bg-red-200 rounded w-24 mb-2"></div>
          <div className="h-4 bg-red-200 rounded w-72"></div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-red-200 rounded w-28"></div>
              <div className="h-3 bg-red-200 rounded w-64"></div>
            </div>
            <div className="h-10 bg-red-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
