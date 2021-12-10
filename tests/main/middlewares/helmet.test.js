const request = require('supertest');

jest.mock('../../../src/main/config/routes', () => jest.fn());

const app = require('../../../src/main/server/app');

describe('Helmet Middleware', () => {
  it('Should set additional headers', async () => {
    app.get('/api/test-helmet', (_req, res) => {
      res.send('');
    });
    const response = await request(app).get('/api/test-helmet');

    expect(response.headers['x-download-options']).toBeDefined();
    expect(response.headers['x-dns-prefetch-control']).toBeDefined();
    expect(response.headers['x-content-type-options']).toBeDefined();
    expect(response.headers['referrer-policy']).toBeDefined();
    expect(response.headers['strict-transport-security']).toBeDefined();
    expect(response.headers['x-xss-protection']).toBeDefined();
    expect(response.headers['x-permitted-cross-domain-policies']).toBeDefined();
  });
});
