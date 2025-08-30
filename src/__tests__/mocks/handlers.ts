import { http, HttpResponse } from 'msw'

// Mock Supabase Auth responses
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
    avatar_url: 'https://example.com/avatar.jpg',
  },
  app_metadata: {
    provider: 'email',
  },
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockSession = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
  token_type: 'bearer',
  user: mockUser,
}

// Mock Supabase database responses
const mockProfile = {
  id: 'test-user-id',
  full_name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
}

const mockEvents = [
  {
    id: 'event-1',
    title: 'Test Event 1',
    description: 'Test event description',
    date: '2024-12-25T00:00:00Z',
    location: 'Test Location',
    qr_code: 'test-qr-code-1',
    created_by: 'test-user-id',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'event-2',
    title: 'Test Event 2',
    description: 'Another test event',
    date: '2024-12-26T00:00:00Z',
    location: 'Another Location',
    qr_code: 'test-qr-code-2',
    created_by: 'test-user-id',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
]

const mockPhotos = [
  {
    id: 'photo-1',
    event_id: 'event-1',
    uploaded_by: 'test-user-id',
    file_path: 'test-photo-1.jpg',
    thumbnail_path: 'test-thumbnail-1.jpg',
    metadata: {
      width: 1920,
      height: 1080,
      size: 1024000,
    },
    created_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'photo-2',
    event_id: 'event-1',
    uploaded_by: 'test-user-id',
    file_path: 'test-photo-2.jpg',
    thumbnail_path: 'test-thumbnail-2.jpg',
    metadata: {
      width: 1920,
      height: 1080,
      size: 2048000,
    },
    created_at: '2024-01-01T00:00:00Z',
  },
]

export const handlers = [
  // Supabase Auth endpoints
  http.post('*/auth/v1/token', () => {
    return HttpResponse.json({
      access_token: mockSession.access_token,
      refresh_token: mockSession.refresh_token,
      expires_in: mockSession.expires_in,
      token_type: mockSession.token_type,
      user: mockUser,
    })
  }),

  http.post('*/auth/v1/signup', () => {
    return HttpResponse.json({
      user: mockUser,
      session: mockSession,
    })
  }),

  http.post('*/auth/v1/signin', () => {
    return HttpResponse.json({
      user: mockUser,
      session: mockSession,
    })
  }),

  http.post('*/auth/v1/logout', () => {
    return HttpResponse.json({})
  }),

  http.get('*/auth/v1/user', () => {
    return HttpResponse.json(mockUser)
  }),

  // Supabase Database endpoints
  http.get('*/rest/v1/profiles', () => {
    return HttpResponse.json([mockProfile])
  }),

  http.get('*/rest/v1/profiles*', () => {
    return HttpResponse.json(mockProfile)
  }),

  http.post('*/rest/v1/profiles', () => {
    return HttpResponse.json(mockProfile)
  }),

  http.patch('*/rest/v1/profiles*', () => {
    return HttpResponse.json(mockProfile)
  }),

  http.get('*/rest/v1/events', () => {
    return HttpResponse.json(mockEvents)
  }),

  http.get('*/rest/v1/events*', () => {
    return HttpResponse.json(mockEvents[0])
  }),

  http.post('*/rest/v1/events', () => {
    return HttpResponse.json(mockEvents[0])
  }),

  http.patch('*/rest/v1/events*', () => {
    return HttpResponse.json(mockEvents[0])
  }),

  http.delete('*/rest/v1/events*', () => {
    return HttpResponse.json({})
  }),

  http.get('*/rest/v1/photos', () => {
    return HttpResponse.json(mockPhotos)
  }),

  http.get('*/rest/v1/photos*', () => {
    return HttpResponse.json(mockPhotos[0])
  }),

  http.post('*/rest/v1/photos', () => {
    return HttpResponse.json(mockPhotos[0])
  }),

  http.patch('*/rest/v1/photos*', () => {
    return HttpResponse.json(mockPhotos[0])
  }),

  http.delete('*/rest/v1/photos*', () => {
    return HttpResponse.json({})
  }),

  // Supabase Storage endpoints
  http.post('*/storage/v1/object/*', () => {
    return HttpResponse.json({
      path: 'test-upload-path',
      id: 'test-file-id',
    })
  }),

  http.get('*/storage/v1/object/*', () => {
    return HttpResponse.json({
      data: new Blob(['test file content'], { type: 'image/jpeg' }),
    })
  }),

  http.delete('*/storage/v1/object/*', () => {
    return HttpResponse.json({})
  }),

  // Health check endpoint
  http.get('*/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
    })
  }),

  // Test endpoint
  http.get('*/api/test', () => {
    return HttpResponse.json({
      message: 'Test endpoint working',
      timestamp: new Date().toISOString(),
    })
  }),

  // Fallback for any unmatched requests
  http.all('*', () => {
    console.warn('Unhandled request in MSW:', new URL(import.meta.url).href)
    return HttpResponse.json(
      { error: 'Unhandled request in MSW' },
      { status: 500 }
    )
  }),
]
