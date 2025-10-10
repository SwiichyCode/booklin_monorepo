describe('Jest Setup', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2);
  });

  it('should have access to reflect-metadata', () => {
    expect(Reflect).toBeDefined();
  });

  it('should have test environment variables', () => {
    expect(process.env.NODE_ENV).toBe('test');
    expect(process.env.JWT_SECRET).toBe('test-secret-key-for-testing');
  });
});
