'use client';

import { useState, useEffect } from 'react';
import { pwaManager, PWAState } from '@/lib/pwa';

export function usePWA() {
  const [state, setState] = useState<PWAState>(pwaManager.getState());

  useEffect(() => {
    const unsubscribe = pwaManager.subscribe(setState);
    return unsubscribe;
  }, []);

  return {
    ...state,
    install: pwaManager.install.bind(pwaManager),
    update: pwaManager.updateApp.bind(pwaManager),
    checkForUpdates: pwaManager.checkForUpdates.bind(pwaManager),
    clearCaches: pwaManager.clearCaches.bind(pwaManager),
    getCacheInfo: pwaManager.getCacheInfo.bind(pwaManager),
  };
}
