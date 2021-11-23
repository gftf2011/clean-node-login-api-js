const request = require('supertest');

jest.mock('../../../src/main/config/routes', () => jest.fn());

const app = require('../../../src/main/server/app');

describe('App Setup', () => {
  it('Should disable "X-Powered-By" response header', async () => {
    app.get('/api/test-x-powered-by', (_req, res) => {
      res.send('');
    });
    const response = await request(app).get('/api/test-x-powered-by');

    expect(response.headers['x-powered-by']).toBeUndefined();
  });
});
