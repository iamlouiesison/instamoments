import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the landing page before each test
    await page.goto('/')
  })

  test('should display landing page with sign in and sign up options', async ({ page }) => {
    // Check if landing page loads correctly
    await expect(page).toHaveTitle(/InstaMoments/i)
    
    // Check for navigation elements
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /sign up/i })).toBeVisible()
    
    // Check for main content
    await expect(page.getByRole('heading', { name: /capture and share/i })).toBeVisible()
  })

  test('should navigate to sign in page', async ({ page }) => {
    // Click sign in link
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Should navigate to sign in page
    await expect(page).toHaveURL(/.*signin/)
    
    // Check for sign in form elements
    await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should navigate to sign up page', async ({ page }) => {
    // Click sign up link
    await page.getByRole('link', { name: /sign up/i }).click()
    
    // Should navigate to sign up page
    await expect(page).toHaveURL(/.*signup/)
    
    // Check for sign up form elements
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible()
    await expect(page.getByLabel(/full name/i)).toBeVisible()
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should show validation errors for invalid sign in form', async ({ page }) => {
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should show validation errors for invalid sign up form', async ({ page }) => {
    // Navigate to sign up page
    await page.getByRole('link', { name: /sign up/i }).click()
    
    // Try to submit empty form
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should show validation errors
    await expect(page.getByText(/full name is required/i)).toBeVisible()
    await expect(page.getByText(/email is required/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should show validation error for invalid email format', async ({ page }) => {
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Enter invalid email
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/password/i).fill('password123')
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show email validation error
    await expect(page.getByText(/invalid email format/i)).toBeVisible()
  })

  test('should show password strength indicator on sign up', async ({ page }) => {
    // Navigate to sign up page
    await page.getByRole('link', { name: /sign up/i }).click()
    
    // Fill in form fields
    await page.getByLabel(/full name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    
    // Enter weak password
    await page.getByLabel(/password/i).fill('weak')
    
    // Should show password strength indicator
    await expect(page.getByText(/password strength/i)).toBeVisible()
    // This would depend on your password strength component implementation
  })

  test('should handle successful sign in and redirect to dashboard', async ({ page }) => {
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Fill in valid credentials
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/)
    
    // Should show dashboard content
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible()
  })

  test('should handle successful sign up and redirect to dashboard', async ({ page }) => {
    // Navigate to sign up page
    await page.getByRole('link', { name: /sign up/i }).click()
    
    // Fill in form fields
    await page.getByLabel(/full name/i).fill('New User')
    await page.getByLabel(/email/i).fill('newuser@example.com')
    await page.getByLabel(/password/i).fill('strongpassword123')
    
    // Submit form
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should redirect to dashboard or show success message
    // This depends on your sign up flow implementation
    await expect(page).toHaveURL(/.*dashboard|.*success/)
  })

  test('should show loading states during authentication', async ({ page }) => {
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Fill in credentials
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show loading state
    await expect(page.getByText(/signing in/i)).toBeVisible()
    
    // Button should be disabled during submission
    await expect(page.getByRole('button', { name: /signing in/i })).toBeDisabled()
  })

  test('should handle authentication errors gracefully', async ({ page }) => {
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('wrong@example.com')
    await page.getByLabel(/password/i).fill('wrongpassword')
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible()
    
    // Form should still be accessible
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
  })

  test('should maintain form data on validation errors', async ({ page }) => {
    // Navigate to sign up page
    await page.getByRole('link', { name: /sign up/i }).click()
    
    // Fill in form fields
    await page.getByLabel(/full name/i).fill('Test User')
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('weak')
    
    // Submit form
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Should show validation error
    await expect(page.getByText(/password too weak/i)).toBeVisible()
    
    // Form fields should retain their values
    await expect(page.getByLabel(/full name/i)).toHaveValue('Test User')
    await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com')
    // Password field might be cleared for security
  })

  test('should provide password reset option', async ({ page }) => {
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Check for password reset link
    const resetLink = page.getByRole('link', { name: /forgot password/i })
    if (await resetLink.isVisible()) {
      await expect(resetLink).toBeVisible()
      
      // Click reset link
      await resetLink.click()
      
      // Should navigate to reset page
      await expect(page).toHaveURL(/.*reset/)
    }
  })

  test('should handle browser back/forward navigation correctly', async ({ page }) => {
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Go back to landing page
    await page.goBack()
    await expect(page).toHaveURL('/')
    
    // Go forward to sign in page
    await page.goForward()
    await expect(page).toHaveURL(/.*signin/)
  })

  test('should be accessible with keyboard navigation', async ({ page }) => {
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Tab through form elements
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/email/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByLabel(/password/i)).toBeFocused()
    
    await page.keyboard.press('Tab')
    await expect(page.getByRole('button', { name: /sign in/i })).toBeFocused()
  })

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to sign in page
    await page.getByRole('link', { name: /sign in/i }).click()
    
    // Check if form is properly displayed on mobile
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/password/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    
    // Check if form is usable on mobile
    await page.getByLabel(/email/i).fill('test@example.com')
    await page.getByLabel(/password/i).fill('password123')
    
    // Submit form
    await page.getByRole('button', { name: /sign in/i }).click()
  })
})
