import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Mock Supabase client for tests
const mockSupabaseClient = {
  auth: {
    getSession: jest.fn(),
    onAuthStateChange: jest.fn(),
    signInWithPassword: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  })),
  storage: {
    from: jest.fn(() => ({
      upload: jest.fn(),
      download: jest.fn(),
      remove: jest.fn(),
    })),
  },
}

// Mock Next.js router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  pathname: '/',
  query: {},
  asPath: '/',
}

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

// Mock Supabase client
jest.mock('../../lib/supabase/client', () => ({
  createClient: () => mockSupabaseClient,
}))

// Mock Supabase server
jest.mock('../../lib/supabase/server', () => ({
  createClient: () => mockSupabaseClient,
}))

// Create a fresh QueryClient for each test
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,

      },
      mutations: {
        retry: false,
      },
    },
  })

// Custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  queryClient?: QueryClient
}

const customRender = (
  ui: ReactElement,
  options: CustomRenderOptions = {}
) => {
  const { queryClient = createTestQueryClient(), ...renderOptions } = options

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient,
  }
}

// Re-export everything
export * from '@testing-library/react'

// Override render method
export { customRender as render }

// Export test utilities
export { mockSupabaseClient, mockRouter, createTestQueryClient }

// Test data factories
export const createMockUser = (overrides = {}) => ({
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
  ...overrides,
})

export const createMockProfile = (overrides = {}) => ({
  id: 'test-user-id',
  full_name: 'Test User',
  avatar_url: 'https://example.com/avatar.jpg',
  bio: 'Test bio',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockEvent = (overrides = {}) => ({
  id: 'test-event-id',
  title: 'Test Event',
  description: 'Test event description',
  date: '2024-12-25T00:00:00Z',
  location: 'Test Location',
  qr_code: 'test-qr-code',
  created_by: 'test-user-id',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

export const createMockPhoto = (overrides = {}) => ({
  id: 'test-photo-id',
  event_id: 'test-event-id',
  uploaded_by: 'test-user-id',
  file_path: 'test-photo.jpg',
  thumbnail_path: 'test-thumbnail.jpg',
  metadata: {
    width: 1920,
    height: 1080,
    size: 1024000,
  },
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
})

// Common test helpers
export const waitForLoadingToFinish = () =>
  new Promise(resolve => setTimeout(resolve, 0))

export const mockFile = (name: string, type: string, size: number) => {
  const file = new File(['test content'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

export const mockImageFile = (name = 'test-image.jpg', size = 1024000) =>
  mockFile(name, 'image/jpeg', size)

// Accessibility testing helpers
// eslint-disable-next-line @typescript-eslint/no-require-imports
export const axe = require('@axe-core/react')

// Form testing helpers
export const fillForm = async (container: HTMLElement, data: Record<string, string>) => {
  const userEvent = await import('@testing-library/user-event')
  const user = userEvent.default.setup()

  for (const [name, value] of Object.entries(data)) {
    const input = container.querySelector(`[name="${name}"]`) as HTMLInputElement
    if (input) {
      await user.type(input, value)
    }
  }
}

export const submitForm = async (container: HTMLElement) => {
  const userEvent = await import('@testing-library/user-event')
  const user = userEvent.default.setup()

  const submitButton = container.querySelector('button[type="submit"]') as HTMLButtonElement
  if (submitButton) {
    await user.click(submitButton)
  }
}
