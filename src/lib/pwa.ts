// PWA Utilities for Instagram Moments PH
// Handles service worker registration, updates, and PWA lifecycle

export interface PWAInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface PWAState {
  isInstalled: boolean;
  isStandalone: boolean;
  isOnline: boolean;
  hasUpdate: boolean;
  canInstall: boolean;
}

class PWAManager {
  private deferredPrompt: PWAInstallPromptEvent | null = null;
  private updateFound = false;
  private state: PWAState = {
    isInstalled: false,
    isStandalone: false,
    isOnline: false,
    hasUpdate: false,
    canInstall: false,
  };
  private listeners: Set<(state: PWAState) => void> = new Set();
  private initialized = false;

  constructor() {
    // Don't initialize during SSR
    if (typeof window !== 'undefined') {
      this.init();
    }
  }

  private init() {
    if (this.initialized) return;
    this.initialized = true;
    
    this.state.isOnline = navigator.onLine;
    this.checkInstallationStatus();
    this.setupEventListeners();
    this.registerServiceWorker();
  }

  private checkInstallationStatus() {
    // Check if running in standalone mode (installed PWA)
    this.state.isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches || 
      (window.navigator as { standalone?: boolean }).standalone === true;
    
    this.state.isInstalled = this.state.isStandalone;
    
    this.notifyListeners();
  }

  private setupEventListeners() {
    // Online/offline status
    window.addEventListener('online', () => {
      this.state.isOnline = true;
      this.notifyListeners();
    });

    window.addEventListener('offline', () => {
      this.state.isOnline = false;
      this.notifyListeners();
    });

    // Install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e as PWAInstallPromptEvent;
      this.state.canInstall = true;
      this.notifyListeners();
    });

    // App installed
    window.addEventListener('appinstalled', () => {
      this.state.isInstalled = true;
      this.state.canInstall = false;
      this.deferredPrompt = null;
      this.notifyListeners();
      
      // Show success notification
      this.showInstallSuccessNotification();
    });

    // Service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        this.state.hasUpdate = false;
        this.notifyListeners();
      });

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'UPDATE_AVAILABLE') {
          this.state.hasUpdate = true;
          this.notifyListeners();
        }
      });
    }
  }

  private async registerServiceWorker() {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });

      console.log('Service Worker registered:', registration);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              this.state.hasUpdate = true;
              this.notifyListeners();
            }
          });
        }
      });

      // Handle service worker updates
      let refreshing = false;
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });

    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  private showInstallSuccessNotification() {
    if ('serviceWorker' in navigator && 'showNotification' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification('App Installed Successfully! 🎉', {
          body: 'Instagram Moments is now available on your home screen',
          icon: '/icons/icon-192x192.png',
          badge: '/icons/icon-72x72.png',
          tag: 'install-success',
          requireInteraction: true,
        });
      });
    }
  }

  public async install(): Promise<boolean> {
    if (!this.deferredPrompt) {
      return false;
    }

    try {
      await this.deferredPrompt.prompt();
      const { outcome } = await this.deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.deferredPrompt = null;
        this.state.canInstall = false;
        this.notifyListeners();
        return true;
      }
    } catch (error) {
      console.error('Installation failed:', error);
    }
    
    return false;
  }

  public async updateApp(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && registration.waiting) {
        // Send message to waiting service worker to skip waiting
        registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  }

  public getState(): PWAState {
    return { ...this.state };
  }

  public subscribe(listener: (state: PWAState) => void): () => void {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener({ ...this.state });
      } catch (error) {
        console.error('Error in PWA state listener:', error);
      }
    });
  }

  public async checkForUpdates(): Promise<boolean> {
    if (!('serviceWorker' in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();
        return true;
      }
    } catch (error) {
      console.error('Update check failed:', error);
    }
    
    return false;
  }

  public async clearCaches(): Promise<void> {
    if (!('caches' in window)) {
      return;
    }

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
      console.log('All caches cleared');
    } catch (error) {
      console.error('Cache clearing failed:', error);
    }
  }

  public async getCacheInfo(): Promise<{ name: string; size: number }[]> {
    if (!('caches' in window)) {
      return [];
    }

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = await Promise.all(
        cacheNames.map(async (name) => {
          const cache = await caches.open(name);
          const keys = await cache.keys();
          let size = 0;
          
          for (const request of keys) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              size += blob.size;
            }
          }
          
          return { name, size };
        })
      );
      
      return cacheInfo;
    } catch (error) {
      console.error('Cache info retrieval failed:', error);
      return [];
    }
  }
}

// Create singleton instance
export const pwaManager = new PWAManager();

// Export convenience functions
export const getPWAState = () => pwaManager.getState();
export const installPWA = () => pwaManager.install();
export const updatePWA = () => pwaManager.updateApp();
export const checkForUpdates = () => pwaManager.checkForUpdates();
export const clearPWACaches = () => pwaManager.clearCaches();
export const getCacheInfo = () => pwaManager.getCacheInfo();

// Hook for React components
export function usePWA() {
  // Note: This hook requires React to be imported in the component file
  // Usage: import { usePWA } from '@/lib/pwa';
  // import { useState, useEffect } from 'react';
  
  // This is a placeholder - the actual hook implementation should be in a separate file
  // or the component should import React hooks directly
  throw new Error('usePWA hook requires React imports. Use the pwaManager directly or implement the hook in your component.');
}
