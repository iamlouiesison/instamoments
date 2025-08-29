import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center px-4">
        <div className="mb-8">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Search className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved. 
            Let&apos;s get you back on track to capturing beautiful moments.
          </p>
        </div>

        <div className="space-y-4">
          <Button asChild className="w-full">
            <Link href="/" className="flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go to Homepage
            </Link>
          </Button>
          
          <Button variant="outline" asChild className="w-full">
            <Link href="/how-it-works" className="flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Learn How It Works
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-sm text-muted-foreground">
          <p>Looking for something specific? Try these popular pages:</p>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            <Link 
              href="/pricing" 
              className="text-primary hover:underline px-2 py-1 rounded hover:bg-muted transition-colors"
            >
              Pricing
            </Link>
            <Link 
              href="/contact" 
              className="text-primary hover:underline px-2 py-1 rounded hover:bg-muted transition-colors"
            >
              Contact
            </Link>
            <Link 
              href="/success-stories" 
              className="text-primary hover:underline px-2 py-1 rounded hover:bg-muted transition-colors"
            >
              Success Stories
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-xs text-muted-foreground">
          <p>Need help? Contact us at{' '}
            <a 
              href="mailto:support@instamoments.ph" 
              className="text-primary hover:underline"
            >
              support@instamoments.ph
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
