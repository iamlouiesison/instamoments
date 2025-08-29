'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, X, Download } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWAUpdate() {
  const { hasUpdate, update } = usePWA();
  const [showUpdate, setShowUpdate] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (hasUpdate) {
      setShowUpdate(true);
    }
  }, [hasUpdate]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await update();
      // The page will reload automatically after update
    } catch (error) {
      console.error('Update failed:', error);
      setIsUpdating(false);
    }
  };

  const handleDismiss = () => {
    setShowUpdate(false);
    // Re-show after a delay
    setTimeout(() => setShowUpdate(true), 60000); // 1 minute
  };

  if (!showUpdate || !hasUpdate) {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <Card className="shadow-lg border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Download className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-gray-800">
                  Update Available
                </CardTitle>
                <CardDescription className="text-xs text-gray-600">
                  New version of Instagram Moments
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0 hover:bg-blue-100"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-xs text-gray-600">
              A new version of Instagram Moments is available with improvements and bug fixes.
            </p>
            
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
              {isUpdating ? 'Updating...' : 'Update Now'}
            </Button>
            
            <div className="text-xs text-gray-500 text-center">
              The app will restart automatically after the update.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
