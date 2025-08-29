import { redirect } from 'next/navigation';
import { getCurrentUserAction } from '@/lib/auth-actions';

export default async function DashboardPage() {
  // Check if user is authenticated
  const userResult = await getCurrentUserAction();
  
  if (!userResult.success || !userResult.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to InstaMoments, {userResult.profile?.full_name || userResult.user.email}!
          </h1>
          <p className="text-gray-600 mb-6">
            You&apos;re successfully signed in. This is your dashboard where you&apos;ll be able to manage your events.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <h2 className="text-lg font-medium text-blue-900 mb-2">
              🚧 Dashboard Under Construction
            </h2>
            <p className="text-blue-700">
              We&apos;re working hard to build your event management dashboard. Soon you&apos;ll be able to:
            </p>
            <ul className="mt-2 text-blue-700 space-y-1">
              <li>• Create and manage events</li>
              <li>• Generate QR codes for guest access</li>
              <li>• View real-time photo galleries</li>
              <li>• Manage your subscription and billing</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
