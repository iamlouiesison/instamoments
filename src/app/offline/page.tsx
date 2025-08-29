'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wifi, WifiOff, Camera, RefreshCw, Home } from 'lucide-react';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const checkOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    // Check initial status
    checkOnlineStatus();

    // Listen for online/offline events
    window.addEventListener('online', checkOnlineStatus);
    window.addEventListener('offline', checkOnlineStatus);

    return () => {
      window.removeEventListener('online', checkOnlineStatus);
      window.removeEventListener('offline', checkOnlineStatus);
    };
  }, []);

  const handleRetry = async () => {
    setRetryCount(prev => prev + 1);
    
    try {
      // Try to fetch a simple resource to test connectivity
      const response = await fetch('/api/test', { 
        method: 'HEAD',
        cache: 'no-cache' 
      });
      
      if (response.ok) {
        setIsOnline(true);
        // Redirect to home page after successful connection
        window.location.href = '/';
      }
    } catch {
      console.log('Still offline, retry failed');
    }
  };

  const handleGoHome = () => {
    // Try to navigate to home page
    window.location.href = '/';
  };

  if (isOnline) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100">
        <Card className="w-full max-w-md mx-4 text-center">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Wifi className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-800">
              You&apos;re Back Online!
            </CardTitle>
            <CardDescription>
              Redirecting you to Instagram Moments...
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleGoHome}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to App
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
                      <CardTitle className="text-2xl font-bold text-gray-800">
              You&apos;re Offline
            </CardTitle>
            <CardDescription className="text-gray-600">
              Don&apos;t worry! You can still access some features while offline.
            </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Offline Features */}
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700">Available Offline:</h3>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Camera className="w-5 h-5 text-amber-600" />
              <span className="text-sm text-gray-600">
                Camera access (photos stored locally)
              </span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 text-amber-600">📱</div>
              <span className="text-sm text-gray-600">
                Previously viewed galleries
              </span>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-5 h-5 text-amber-600">⚙️</div>
              <span className="text-sm text-gray-600">
                App settings and preferences
              </span>
            </div>
          </div>

          {/* Connection Status */}
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Connection Status:</strong> No internet connection detected
            </p>
            {retryCount > 0 && (
              <p className="text-xs text-blue-600 mt-1">
                Retry attempts: {retryCount}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleRetry}
              className="w-full bg-amber-600 hover:bg-amber-700"
              disabled={retryCount >= 3}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${retryCount >= 3 ? 'animate-spin' : ''}`} />
              {retryCount >= 3 ? 'Too Many Retries' : 'Try Again'}
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleGoHome}
              className="w-full"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home Page
            </Button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-gray-500 space-y-2">
            <p>
              <strong>Tip:</strong> Check your internet connection and try again.
            </p>
            <p>
              Your photos are safe and will sync when you&apos;re back online.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
