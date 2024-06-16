const request = require('supertest');
const app = require('../app');
const User = require('../models/User.model');
const jwt = require('jsonwebtoken')

describe('refreshAccessToken', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('should return 401 if no refresh token is provided', async () => {
    const res = await request(app).post('/api/refresh');
    expect(res.statusCode).toBe(401);
  });

  it('should return 403 if user is not found', async () => {
    const refreshToken = jwt.sign(
      { userId: '123', role: 'client' },
      process.env.REFRESH_TOKEN_SECRET
    );
    const res = await request(app)
      .post('/api/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should return 403 if refresh token is reused', async () => {
    const user = new User({
      username: 'test',
      role: 'client',
      email: 'test@example.com',
      hash: 'test',
      refreshTokens: ['refreshToken1'],
    });
    await user.save();
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET
    );
    const res = await request(app)
      .post('/api/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should return 403 if refresh token is invalid', async () => {
    const user = new User({
      username: 'test',
      email: 'test@example.com',
      role: 'client',
      hash: 'test',
      refreshTokens: ['refreshToken1'],
    });
    await user.save();
    const refreshToken = 'invalidToken';
    const res = await request(app)
      .post('/api/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(res.statusCode).toBe(403);
  });

  it('should return 200 and new access and refresh tokens', async () => {
    const user = new User({
      username: 'test',
      email: 'test@example.com',
      role: 'client',
      hash: 'test',
      refreshTokens: ['refreshToken1'],
    });
    await user.save();
    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.REFRESH_TOKEN_SECRET
    );
    const res = await request(app)
      .post('/api/refresh')
      .set('Cookie', `refreshToken=${refreshToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });
});


