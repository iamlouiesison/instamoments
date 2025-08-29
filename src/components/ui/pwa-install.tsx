'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X, Download, Smartphone, Monitor } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkInstallation = () => {
      // Check if running in standalone mode (installed PWA)
      if (window.matchMedia('(display-mode: standalone)').matches || 
          (window.navigator as { standalone?: boolean }).standalone === true) {
        setIsStandalone(true);
        setIsInstalled(true);
        return;
      }

      // Check if app is installed by looking for specific PWA features
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        // App might be installed, but we can't be 100% sure
        // We'll show the prompt anyway for better UX
      }
    };

    checkInstallation();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setDeferredPrompt(null);
      
      // Show success message
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then((registration) => {
          registration.showNotification('App Installed!', {
            body: 'Instagram Moments is now installed on your device',
            icon: '/icons/icon-192x192.png',
            badge: '/icons/icon-72x72.png',
          });
        });
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    try {
      // Show the install prompt
      await deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setShowInstallPrompt(false);
      } else {
        console.log('User dismissed the install prompt');
        // Hide the prompt for now, but show it again later
        setShowInstallPrompt(false);
        // Re-show after a delay
        setTimeout(() => setShowInstallPrompt(true), 30000); // 30 seconds
      }
    } catch (error) {
      console.error('Error during installation:', error);
    }
    
    // Clear the deferred prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Re-show after a longer delay
    setTimeout(() => setShowInstallPrompt(true), 300000); // 5 minutes
  };

  // Don't show if already installed or in standalone mode
  if (isInstalled || isStandalone || !showInstallPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="shadow-lg border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <Download className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-800">
                  Install Instagram Moments
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  Get the full app experience
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 hover:bg-amber-100"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Benefits */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Smartphone className="w-3 h-3 text-amber-600" />
                <span>Access from home screen</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Monitor className="w-3 h-3 text-amber-600" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-3 h-3 text-amber-600">📱</div>
                <span>Faster loading</span>
              </div>
            </div>

            {/* Install Button */}
            <Button
              onClick={handleInstall}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white text-sm py-2"
            >
              <Download className="w-4 h-4 mr-2" />
              Install App
            </Button>

            {/* Platform-specific info */}
            <div className="text-xs text-gray-500 text-center">
              {navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad') ? (
                <p>Tap the share button and select &quot;Add to Home Screen&quot;</p>
              ) : navigator.userAgent.includes('Android') ? (
                <p>Tap &quot;Install&quot; to add to your home screen</p>
              ) : (
                <p>Click &quot;Install&quot; to add to your desktop</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Hook for managing PWA installation state
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setIsInstallable(false);
        return true;
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
    
    return false;
  };

  return {
    isInstallable,
    install,
  };
}
