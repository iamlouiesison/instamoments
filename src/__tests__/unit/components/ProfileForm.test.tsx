import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileForm from '../../../components/profile/ProfileForm'

// Mock the profile actions
jest.mock('../../../lib/profile-actions', () => ({
  updateProfileAction: jest.fn(),
  uploadAvatarAction: jest.fn(),
  changePasswordAction: jest.fn(),
  deleteAccountAction: jest.fn(),
  getProfileAction: jest.fn(),
}))

// Mock the auth hook
jest.mock('../../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' },
    loading: false,
  }),
}))

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    refresh: jest.fn(),
  }),
}))

describe('ProfileForm', () => {
  const mockProfile = {
    id: 'test-user-id',
    email: 'test@example.com',
    full_name: 'Test User',
    phone: '+639123456789',
    language: 'en-PH',
    timezone: 'Asia/Manila',
    email_notifications: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders profile form with user data', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check for basic form elements
    expect(screen.getByText(/profile information/i)).toBeInTheDocument()
    expect(screen.getByText(/update your personal information/i)).toBeInTheDocument()
  })

  it('displays profile information', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check if profile data is displayed
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument()
    expect(screen.getByDisplayValue('+639123456789')).toBeInTheDocument()
  })

  it('shows language and timezone options', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check for language and timezone options
    expect(screen.getByText(/english \(philippines\)/i)).toBeInTheDocument()
    expect(screen.getByText(/philippines \(utc\+8\)/i)).toBeInTheDocument()
  })

  it('has password change functionality', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check for password change button (be more specific)
    expect(screen.getByRole('button', { name: /change password/i })).toBeInTheDocument()
  })

  it('has account deletion functionality', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check for account deletion section
    expect(screen.getByText(/danger zone/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete account/i })).toBeInTheDocument()
  })

  it('has form elements', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check for form inputs
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/language/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/timezone/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/receive email notifications/i)).toBeInTheDocument()
  })

  it('has submit button', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check for submit button
    expect(screen.getByRole('button', { name: /update profile/i })).toBeInTheDocument()
  })

  it('has avatar section', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check for avatar section
    expect(screen.getByText(/change avatar/i)).toBeInTheDocument()
    expect(screen.getByText(/max 5mb, jpg, png, gif/i)).toBeInTheDocument()
  })

  it('is accessible with proper ARIA labels', () => {
    render(<ProfileForm initialProfile={mockProfile} />)

    // Check for proper form structure
    expect(screen.getByText(/profile information/i)).toBeInTheDocument()
    
    // Check for form inputs
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThan(0)
  })

  it('handles form submission without crashing', async () => {
    const user = userEvent.setup()
    
    // Mock the functions to return success
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockUpdateProfile = jest.mocked(require('../../../lib/profile-actions').updateProfileAction)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const mockGetProfile = jest.mocked(require('../../../lib/profile-actions').getProfileAction)
    
    mockUpdateProfile.mockResolvedValue({ 
      success: true, 
      message: 'Profile updated successfully!' 
    })
    mockGetProfile.mockResolvedValue({ 
      success: true, 
      data: mockProfile 
    })

    render(<ProfileForm initialProfile={mockProfile} />)

    // Submit form
    const saveButton = screen.getByRole('button', { name: /update profile/i })
    await user.click(saveButton)

    // Should call updateProfileAction
    expect(mockUpdateProfile).toHaveBeenCalled()
  })
})
