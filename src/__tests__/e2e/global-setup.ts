import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const { baseURL } = config.projects[0].use

  // Start the browser and create a new page
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // Navigate to the base URL to ensure the app is accessible
  await page.goto(baseURL || 'http://localhost:3000')

  // Wait for the page to load
  await page.waitForLoadState('networkidle')

  // Take a screenshot of the initial state for debugging
  await page.screenshot({ path: 'test-results/global-setup.png' })

  // Close the browser
  await browser.close()

  console.log('✅ Global setup completed successfully')
}

export default globalSetup
