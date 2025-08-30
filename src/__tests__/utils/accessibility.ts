// @ts-expect-error - jest-axe types are not available
import { axe, toHaveNoViolations } from 'jest-axe'

// Extend Jest matchers with accessibility testing
expect.extend(toHaveNoViolations)

// Accessibility testing utilities
export const testAccessibility = async (container: HTMLElement) => {
  const results = await axe(container)
  expect(results).toHaveNoViolations()
}

// Common accessibility test patterns
export const accessibilityTestPatterns = {
  // Test form accessibility
  testFormAccessibility: async (container: HTMLElement) => {
    // Check for proper form labels
    const inputs = container.querySelectorAll('input, textarea, select')
    inputs.forEach(input => {
      const id = input.getAttribute('id')
      const label = container.querySelector(`label[for="${id}"]`)
      expect(label).toBeTruthy()
    })

    // Check for proper ARIA attributes
    const requiredInputs = container.querySelectorAll('[required]')
    requiredInputs.forEach(input => {
      expect(input).toHaveAttribute('aria-required', 'true')
    })

    // Test with axe-core
    await testAccessibility(container)
  },

  // Test navigation accessibility
  testNavigationAccessibility: async (container: HTMLElement) => {
    // Check for proper navigation landmarks
    const nav = container.querySelector('nav')
    if (nav) {
      expect(nav).toHaveAttribute('aria-label')
    }

    // Check for skip links
    const skipLinks = container.querySelectorAll('a[href^="#"]')
    if (skipLinks.length > 0) {
      skipLinks.forEach(link => {
        expect(link.textContent).toMatch(/skip|jump to/i)
      })
    }

    // Test with axe-core
    await testAccessibility(container)
  },

  // Test image accessibility
  testImageAccessibility: async (container: HTMLElement) => {
    const images = container.querySelectorAll('img')
    images.forEach(img => {
      // Decorative images should have empty alt or role="presentation"
      const alt = img.getAttribute('alt')
      const role = img.getAttribute('role')
      
      if (role === 'presentation') {
        expect(alt).toBe('')
      } else {
        // Informative images should have meaningful alt text
        expect(alt).toBeTruthy()
        expect(alt).not.toBe('')
      }
    })

    // Test with axe-core
    await testAccessibility(container)
  },

  // Test button accessibility
  testButtonAccessibility: async (container: HTMLElement) => {
    const buttons = container.querySelectorAll('button')
    buttons.forEach(button => {
      // Buttons should have accessible names
      const accessibleName = button.textContent?.trim() || button.getAttribute('aria-label')
      expect(accessibleName).toBeTruthy()
      
      // Buttons should not have both aria-label and aria-labelledby
      const ariaLabel = button.getAttribute('aria-label')
      const ariaLabelledBy = button.getAttribute('aria-labelledby')
      if (ariaLabel && ariaLabelledBy) {
        console.warn('Button has both aria-label and aria-labelledby:', button)
      }
    })

    // Test with axe-core
    await testAccessibility(container)
  },

  // Test color contrast (basic check)
  testColorContrast: async (container: HTMLElement) => {
    // This is a basic check - axe-core will do more thorough contrast testing
    const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div')
    
    // Check for very small text that might have contrast issues
    textElements.forEach(element => {
      const style = window.getComputedStyle(element)
      const fontSize = parseFloat(style.fontSize)
      const fontWeight = style.fontWeight
      
      // Small text should have sufficient contrast
      if (fontSize < 18 && fontWeight === 'normal') {
        // This is a basic check - axe-core will do actual contrast testing
        console.log('Small text detected, ensure sufficient contrast:', element.textContent)
      }
    })
  },

  // Test keyboard navigation
  testKeyboardNavigation: async (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    )
    
    // All focusable elements should be reachable via keyboard
    focusableElements.forEach(element => {
      expect(element).not.toHaveAttribute('tabindex', '-1')
    })

    // Test with axe-core
    await testAccessibility(container)
  },

  // Test screen reader compatibility
  testScreenReaderCompatibility: async (container: HTMLElement) => {
    // Check for proper heading structure
    const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))
    
    // Heading levels should not skip (e.g., h1 -> h3)
    for (let i = 1; i < headingLevels.length; i++) {
      const current = headingLevels[i]
      const previous = headingLevels[i - 1]
      expect(current - previous).toBeLessThanOrEqual(1)
    }

    // Check for proper landmarks
    const main = container.querySelector('main')
    if (main) {
      expect(main).toHaveAttribute('role', 'main')
    }

    // Test with axe-core
    await testAccessibility(container)
  },

  // Test mobile accessibility
  testMobileAccessibility: async (container: HTMLElement) => {
    // Check for touch target sizes
    const touchTargets = container.querySelectorAll('button, a, input, select')
    touchTargets.forEach(target => {
      const rect = target.getBoundingClientRect()
      const minSize = 44 // Minimum touch target size in pixels
      
      if (rect.width < minSize || rect.height < minSize) {
        console.warn('Touch target may be too small:', target, rect)
      }
    })

    // Check for viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    expect(viewportMeta).toBeTruthy()

    // Test with axe-core
    await testAccessibility(container)
  },

  // Comprehensive accessibility test
  testFullAccessibility: async (container: HTMLElement) => {
    // Run all accessibility tests
    await accessibilityTestPatterns.testFormAccessibility(container)
    await accessibilityTestPatterns.testNavigationAccessibility(container)
    await accessibilityTestPatterns.testImageAccessibility(container)
    await accessibilityTestPatterns.testButtonAccessibility(container)
    await accessibilityTestPatterns.testColorContrast(container)
    await accessibilityTestPatterns.testKeyboardNavigation(container)
    await accessibilityTestPatterns.testScreenReaderCompatibility(container)
    await accessibilityTestPatterns.testMobileAccessibility(container)
    
    // Final axe-core test
    await testAccessibility(container)
  }
}

// Export the main accessibility test function
export const testAccessibilityComprehensive = accessibilityTestPatterns.testFullAccessibility

// Export individual test functions
export const {
  testFormAccessibility,
  testNavigationAccessibility,
  testImageAccessibility,
  testButtonAccessibility,
  testColorContrast,
  testKeyboardNavigation,
  testScreenReaderCompatibility,
  testMobileAccessibility
} = accessibilityTestPatterns
