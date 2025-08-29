'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Smartphone, 
  Wifi, 
  WifiOff, 
  Download, 
  RefreshCw, 
  Trash2, 
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

export function PWAStatus() {
  const { 
    isInstalled, 
    isStandalone, 
    isOnline, 
    hasUpdate, 
    canInstall,
    install,
    update,
    checkForUpdates,
    clearCaches,
    getCacheInfo
  } = usePWA();
  
  const [cacheInfo, setCacheInfo] = useState<{ name: string; size: number }[]>([]);
  const [isLoadingCache, setIsLoadingCache] = useState(false);

  const loadCacheInfo = async () => {
    setIsLoadingCache(true);
    try {
      const info = await getCacheInfo();
      setCacheInfo(info);
    } catch (error) {
      console.error('Failed to load cache info:', error);
    } finally {
      setIsLoadingCache(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Smartphone className="w-5 h-5 text-amber-600" />
          <span>PWA Status</span>
        </CardTitle>
        <CardDescription>
          Progressive Web App information and settings
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Status Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {isInstalled ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="text-sm font-medium">Installation</div>
            <Badge variant={isInstalled ? "default" : "secondary"}>
              {isInstalled ? 'Installed' : 'Not Installed'}
            </Badge>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {isStandalone ? (
                <CheckCircle className="w-6 h-6 text-green-600" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="text-sm font-medium">Standalone</div>
            <Badge variant={isStandalone ? "default" : "secondary"}>
              {isStandalone ? 'Yes' : 'No'}
            </Badge>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {isOnline ? (
                <Wifi className="w-6 h-6 text-green-600" />
              ) : (
                <WifiOff className="w-6 h-6 text-red-600" />
              )}
            </div>
            <div className="text-sm font-medium">Connection</div>
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              {hasUpdate ? (
                <RefreshCw className="w-6 h-6 text-blue-600" />
              ) : (
                <CheckCircle className="w-6 h-6 text-green-600" />
              )}
            </div>
            <div className="text-sm font-medium">Updates</div>
            <Badge variant={hasUpdate ? "destructive" : "default"}>
              {hasUpdate ? 'Available' : 'Up to Date'}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">Actions</h4>
          
          <div className="flex flex-wrap gap-2">
            {canInstall && !isInstalled && (
              <Button onClick={install} className="bg-amber-600 hover:bg-amber-700">
                <Download className="w-4 h-4 mr-2" />
                Install App
              </Button>
            )}
            
            {hasUpdate && (
              <Button onClick={update} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Update App
              </Button>
            )}
            
            <Button onClick={checkForUpdates} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Check for Updates
            </Button>
            
            <Button onClick={loadCacheInfo} variant="outline" disabled={isLoadingCache}>
              <Info className="w-4 h-4 mr-2" />
              {isLoadingCache ? 'Loading...' : 'Cache Info'}
            </Button>
            
            <Button 
              onClick={clearCaches} 
              variant="outline" 
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Caches
            </Button>
          </div>
        </div>

        {/* Cache Information */}
        {cacheInfo.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Cache Information</h4>
            <div className="space-y-2">
              {cacheInfo.map((cache) => (
                <div key={cache.name} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{cache.name}</span>
                  <span className="text-sm text-gray-600">{formatBytes(cache.size)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PWA Features */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">PWA Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Offline functionality</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Home screen installation</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Push notifications</span>
            </div>
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm">Background sync</span>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="p-3 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">💡 Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Install the app for the best experience</li>
            <li>• The app works offline for basic features</li>
            <li>• Updates are automatic when online</li>
            <li>• Clear caches if you experience issues</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
