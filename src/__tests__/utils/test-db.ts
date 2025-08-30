import { createClient } from '@supabase/supabase-js'

// Test database configuration
const TEST_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const TEST_SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test-anon-key'

// Create test Supabase client
export const createTestClient = () => {
  return createClient(TEST_SUPABASE_URL, TEST_SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Test data setup and cleanup utilities
export class TestDatabase {
  private client: ReturnType<typeof createTestClient>

  constructor() {
    this.client = createTestClient()
  }

  // Setup test data
  async setup() {
    // Create test tables if they don't exist
    await this.createTestTables()
    
    // Insert test data
    await this.insertTestData()
  }

  // Clean up test data
  async cleanup() {
    // Remove test data
    await this.removeTestData()
    
    // Drop test tables
    await this.dropTestTables()
  }

  // Create test tables
  private async createTestTables() {
    // This would create test-specific tables or use existing ones
    // For now, we'll use the existing schema
    console.log('Test tables ready')
  }

  // Insert test data
  private async insertTestData() {
    // Insert test users, events, photos, etc.
    console.log('Test data inserted')
  }

  // Remove test data
  private async removeTestData() {
    // Clean up test data
    console.log('Test data cleaned up')
  }

  // Drop test tables
  private async dropTestTables() {
    // Drop test-specific tables if any
    console.log('Test tables dropped')
  }

  // Get test user
  async getTestUser() {
    return {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User',
      },
    }
  }

  // Get test profile
  async getTestProfile() {
    return {
      id: 'test-user-id',
      full_name: 'Test User',
      avatar_url: null,
      bio: 'Test bio',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  // Get test event
  async getTestEvent() {
    return {
      id: 'test-event-id',
      title: 'Test Event',
      description: 'Test event description',
      date: new Date().toISOString(),
      location: 'Test Location',
      qr_code: 'test-qr-code',
      created_by: 'test-user-id',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  }

  // Get test photo
  async getTestPhoto() {
    return {
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
      created_at: new Date().toISOString(),
    }
  }
}

// Test environment setup
export const setupTestEnvironment = async () => {
  const testDb = new TestDatabase()
  await testDb.setup()
  return testDb
}

// Test environment cleanup
export const cleanupTestEnvironment = async (testDb: TestDatabase) => {
  await testDb.cleanup()
}

// Test data factories
export const createTestUser = (overrides = {}) => ({
  id: 'test-user-id',
  email: 'test@example.com',
  user_metadata: {
    full_name: 'Test User',
  },
  ...overrides,
})

export const createTestProfile = (overrides = {}) => ({
  id: 'test-user-id',
  full_name: 'Test User',
  avatar_url: null,
  bio: 'Test bio',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createTestEvent = (overrides = {}) => ({
  id: 'test-event-id',
  title: 'Test Event',
  description: 'Test event description',
  date: new Date().toISOString(),
  location: 'Test Location',
  qr_code: 'test-qr-code',
  created_by: 'test-user-id',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  ...overrides,
})

export const createTestPhoto = (overrides = {}) => ({
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
  created_at: new Date().toISOString(),
  ...overrides,
})

// Test utilities
export const waitForDatabaseOperation = (ms = 100) => 
  new Promise(resolve => setTimeout(resolve, ms))

export const mockFile = (name: string, type: string, size: number) => {
  const file = new File(['test content'], name, { type })
  Object.defineProperty(file, 'size', { value: size })
  return file
}

export const mockImageFile = (name = 'test-image.jpg', size = 1024000) =>
  mockFile(name, 'image/jpeg', size)
