import { createTestApp, createTestRequest } from '../helpers/test-server';

describe('Health Check Integration Tests', () => {
  const app = createTestApp();

  // Route de test simple
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: Date.now() });
  });

  it('should return health status', async () => {
    const response = await createTestRequest(app).get('/health');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await createTestRequest(app).get('/unknown-route');

    expect(response.status).toBe(404);
  });
});
