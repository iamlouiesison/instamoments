import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="InstaMoments" />
        <meta name="mobile-web-app-capable" content="yes" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
