import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ErrorBoundary } from '@/components/ui/error-boundary';
import { PWAInstall } from '@/components/ui/pwa-install';
import { PWAUpdate } from '@/components/ui/pwa-update';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InstaMoments - Instant Event Photo Galleries',
  description:
    'Create instant collaborative photo and video galleries for events in the Philippines. Scan QR codes, capture moments, and create beautiful memories together.',
  keywords:
    'event photos, photo sharing, QR code, Philippines, event memories, collaborative galleries, video greetings',
  authors: [{ name: 'InstaMoments Team' }],
  creator: 'InstaMoments',
  publisher: 'InstaMoments',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://instamoments.ph'),
  openGraph: {
    title: 'InstaMoments - Instant Event Photo Galleries',
    description:
      'Create instant collaborative photo and video galleries for events in the Philippines.',
    url: 'https://instamoments.ph',
    siteName: 'InstaMoments',
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InstaMoments - Instant Event Photo Galleries',
    description:
      'Create instant collaborative photo and video galleries for events in the Philippines.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-PH" className="scroll-smooth">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#f59e0b" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Instagram Moments" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="Instagram Moments" />
        <meta name="msapplication-TileColor" content="#f59e0b" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* PWA Links */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.svg" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.svg" />
        <link rel="icon" type="image/svg+xml" sizes="32x32" href="/icons/icon-72x72.svg" />
        <link rel="icon" type="image/svg+xml" sizes="16x16" href="/icons/icon-72x72.svg" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/sw.js" as="script" />
        <link rel="preload" href="/manifest.json" as="fetch" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <PWAInstall />
            <PWAUpdate />
          </div>
        </ErrorBoundary>
      </body>
    </html>
  );
}
