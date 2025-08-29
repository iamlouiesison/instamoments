// Service Worker for Instagram Moments PH
// Handles offline functionality, caching, and camera access

const CACHE_NAME = 'instamoments-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';
const CAMERA_CACHE = 'camera-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event - cache static files
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static files');
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker install failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CAMERA_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - handle different caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle different types of requests
  if (url.pathname.startsWith('/api/')) {
    // API requests - Network First with fallback to cache
    event.respondWith(handleApiRequest(request));
  } else if (url.pathname.startsWith('/camera') || url.pathname.includes('camera')) {
    // Camera-related requests - Cache First for offline functionality
    event.respondWith(handleCameraRequest(request));
  } else if (url.pathname.startsWith('/_next/') || url.pathname.includes('static')) {
    // Static assets - Cache First
    event.respondWith(handleStaticRequest(request));
  } else if (url.pathname.includes('.') && url.pathname.includes('/')) {
    // Other assets - Stale While Revalidate
    event.respondWith(handleAssetRequest(request));
  } else {
    // Page requests - Network First with fallback to cache
    event.respondWith(handlePageRequest(request));
  }
});

// Handle API requests
async function handleApiRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch {
    console.log('Network failed for API request, trying cache');
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline response for API requests
  return new Response(
    JSON.stringify({ 
      error: 'Offline mode', 
      message: 'This feature is not available offline' 
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

// Handle camera requests
async function handleCameraRequest(request) {
  try {
    // Try network first for camera functionality
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache camera responses
      const cache = await caches.open(CAMERA_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch {
    console.log('Network failed for camera request, trying cache');
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline camera page
  return caches.match('/offline');
}

// Handle static requests
async function handleStaticRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    console.log('Static request failed');
    return new Response('Offline', { status: 503 });
  }
}

// Handle asset requests
async function handleAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch {
    console.log('Asset request failed, using cache if available');
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 500 });
  }
}

// Handle page requests
async function handlePageRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful page responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
  } catch {
    console.log('Network failed for page request, trying cache');
  }

  // Fallback to cache
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  // Return offline page
  return caches.match('/offline');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'photo-upload') {
    event.waitUntil(syncPhotoUploads());
  } else if (event.tag === 'event-creation') {
    event.waitUntil(syncEventCreation());
  }
});

// Sync photo uploads when back online
async function syncPhotoUploads() {
  try {
    const cache = await caches.open('photo-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('Photo uploaded successfully');
        }
      } catch (error) {
        console.log('Failed to sync photo:', error);
      }
    }
  } catch (error) {
    console.log('Photo sync failed:', error);
  }
}

// Sync event creation when back online
async function syncEventCreation() {
  try {
    const cache = await caches.open('event-queue');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        const response = await fetch(request);
        if (response.ok) {
          await cache.delete(request);
          console.log('Event created successfully');
        }
      } catch (error) {
        console.log('Failed to sync event:', error);
      }
    }
  } catch (error) {
    console.log('Event sync failed:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New update from Instagram Moments',
      icon: '/icons/icon-192x192.svg',
      badge: '/icons/icon-72x72.svg',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
              actions: [
          {
            action: 'explore',
            title: 'View Event',
            icon: '/icons/icon-96x96.svg'
          },
          {
            action: 'close',
            title: 'Close',
            icon: '/icons/icon-96x96.svg'
          }
        ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Instagram Moments', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling for communication with main thread
self.addEventListener('message', (event) => {
  console.log('Message received in service worker:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

// Error handling
self.addEventListener('error', (event) => {
  console.error('Service Worker error:', event.error);
});

// Unhandled rejection handling
self.addEventListener('unhandledrejection', (event) => {
  console.error('Service Worker unhandled rejection:', event.reason);
});
