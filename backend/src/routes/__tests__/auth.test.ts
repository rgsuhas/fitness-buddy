import request from 'supertest';
import express from 'express';
import authRoutes from '../auth.routes';
import { errorHandler } from '../../utils/errorHandler';

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use(errorHandler); // Add error handling middleware

describe('Auth Routes', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
    expect(res.body.data.user).toHaveProperty('name', 'Test User');
  });

  it('should login an existing user', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.data).toHaveProperty('token');
  });

  it('should not login a user with invalid credentials', async () => {
    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      });
    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('success', false);
    expect(res.body).toHaveProperty('error.message', 'Invalid credentials');
  });
});
