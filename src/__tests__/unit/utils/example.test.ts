describe('Example Test Suite', () => {
  it('should pass a basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle async operations', async () => {
    const result = await Promise.resolve('success')
    expect(result).toBe('success')
  })

  it('should work with test utilities', () => {
    const mockData = { name: 'Test', value: 42 }
    expect(mockData).toHaveProperty('name')
    expect(mockData).toHaveProperty('value')
  })
})
