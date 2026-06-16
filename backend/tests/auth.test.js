import request from 'supertest';
import { createApp } from '../src/app.js';

describe('auth routes', () => {
  it('returns 400 for invalid signup payload', async () => {
    const app = createApp();
    const response = await request(app).post('/api/auth/signup').send({
      fullName: 'AB',
      email: 'invalid',
      password: '123',
      role: 'PATIENT',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Validation failed');
  });

  it('returns 401 when auth header is missing on /me', async () => {
    const app = createApp();
    const response = await request(app).get('/api/auth/me');

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Authentication required');
  });
});
