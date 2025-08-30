# Testing Guide for InstaMoments

## Overview

This document provides comprehensive guidance for testing the InstaMoments PWA application. Our testing strategy follows the testing pyramid approach with unit tests, integration tests, and end-to-end tests.

## Current Status

✅ **Unit Tests**: Working with Jest and React Testing Library
✅ **E2E Tests**: Playwright configuration ready
✅ **Test Infrastructure**: MSW, test utilities, and CI/CD setup
⚠️ **Path Aliases**: Currently using relative paths in tests due to Jest configuration

## Testing Infrastructure

### Tools and Frameworks

- **Unit Testing**: Jest 30+ with React Testing Library
- **E2E Testing**: Playwright
- **API Mocking**: MSW (Mock Service Worker)
- **Coverage**: Jest Coverage with Istanbul
- **Accessibility**: jest-axe
- **CI/CD**: GitHub Actions

### Project Structure

```
src/__tests__/
├── unit/                    # Unit tests
│   ├── auth/               # Authentication tests
│   ├── components/         # Component tests
│   └── utils/              # Utility tests
├── e2e/                    # End-to-end tests
│   ├── auth-flow.spec.ts   # Authentication flow tests
│   ├── global-setup.ts     # Playwright setup
│   └── global-teardown.ts  # Playwright cleanup
├── mocks/                  # API mocking
│   ├── server.ts           # MSW server setup
│   ├── browser.ts          # MSW browser setup
│   └── handlers.ts         # API mock handlers
└── utils/                  # Test utilities
    ├── test-utils.tsx      # React Testing Library utilities
    ├── test-db.ts          # Database test utilities
    └── accessibility.ts    # Accessibility testing utilities
```

## Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm run test:unit -- --testPathPatterns="ProfileForm"
```

### E2E Tests

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e

# Run E2E tests in headed mode
npm run test:e2e:headed

# Run E2E tests on specific browser
npx playwright test --project=chromium
```

### Linting and Type Checking

```bash
# Run ESLint
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check
```

## Test Examples

### Component Testing

```tsx
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfileForm from '../../../components/profile/ProfileForm'

describe('ProfileForm', () => {
  it('renders profile form with user data', () => {
    render(<ProfileForm initialProfile={mockProfile} />)
    expect(screen.getByText(/profile information/i)).toBeInTheDocument()
  })

  it('handles form submission without crashing', async () => {
    const user = userEvent.setup()
    render(<ProfileForm initialProfile={mockProfile} />)
    
    const saveButton = screen.getByRole('button', { name: /update profile/i })
    await user.click(saveButton)
    
    // Verify the form submission logic
  })
})
```

### API Mocking with MSW

```tsx
// In handlers.ts
export const handlers = [
  http.post('/api/auth/signin', () => {
    return HttpResponse.json({ success: true })
  }),
]

// In tests
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

test('handles API response', async () => {
  server.use(
    http.get('/api/data', () => {
      return HttpResponse.json({ data: 'test' })
    })
  )
  
  // Test implementation
})
```

## Test Configuration

### Jest Configuration

```js
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
}

module.exports = createJestConfig(customJestConfig)
```

### Playwright Configuration

```ts
// playwright.config.ts
export default defineConfig({
  testDir: './src/__tests__/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json'], ['junit']],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

## Best Practices

### Writing Tests

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test User Interactions**: Use `userEvent` to simulate real user behavior
4. **Keep Tests Simple**: Each test should verify one specific behavior
5. **Use Descriptive Names**: Test names should clearly describe what is being tested

### Mocking Strategy

1. **Mock External Dependencies**: Use MSW for API calls, mock modules for complex dependencies
2. **Keep Mocks Simple**: Don't over-engineer mocks
3. **Use Realistic Data**: Mock data should represent real-world scenarios
4. **Reset Mocks**: Clear mocks between tests to avoid interference

### Test Organization

1. **Group Related Tests**: Use `describe` blocks to organize related test cases
2. **Follow AAA Pattern**: Arrange, Act, Assert
3. **Use Setup and Teardown**: Leverage `beforeEach` and `afterEach` for common setup
4. **Maintain Test Independence**: Each test should be able to run in isolation

## CI/CD Integration

### GitHub Actions

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test:unit
      - run: npm run test:e2e
```

## Troubleshooting

### Common Issues

1. **Path Resolution**: If tests can't find modules, check relative paths in test files
2. **Mock Not Working**: Ensure mocks are defined before the module is imported
3. **Environment Variables**: Set required environment variables in test setup
4. **Async Operations**: Use `waitFor` or `findBy` for asynchronous operations

### Debugging Tests

```bash
# Run tests with verbose output
npm run test:unit -- --verbose

# Run tests in debug mode
npm run test:unit -- --detectOpenHandles

# Run specific test with debugging
npm run test:unit -- --testNamePattern="specific test name"
```

## Future Improvements

1. **Path Alias Resolution**: Fix Jest configuration to properly resolve `@/` aliases
2. **Test Coverage**: Increase test coverage to meet thresholds
3. **Performance Tests**: Add performance testing with Lighthouse CI
4. **Visual Regression**: Implement visual regression testing
5. **Contract Testing**: Add API contract testing with Pact

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [MSW Documentation](https://mswjs.io/docs/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
