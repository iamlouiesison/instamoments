import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authentication - InstaMoments',
  description: 'Sign in, sign up, or reset your password for InstaMoments - Capture every precious moment together.',
  keywords: 'authentication, sign in, sign up, password reset, InstaMoments, event photos, Philippines',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {children}
    </div>
  );
}
