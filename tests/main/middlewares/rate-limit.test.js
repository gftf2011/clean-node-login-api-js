/* eslint-disable global-require */
const request = require('supertest');

jest.mock('../../../src/main/config/routes', () => jest.fn());

describe('Rate Limit Middleware', () => {
  beforeAll(() => {
    process.env.RATE_LIMIT_ON = 'true';
  });

  it('Should return 200 if API is called once', async () => {
    let app;
    let RedisHelper;
    jest.isolateModules(() => {
      require('../../../src/main/bootstrap');
      app = require('../../../src/main/server/app');
      RedisHelper = require('../../../src/infra/helpers/redis-helper');
    });
    app.get('/api/test-rate-limit', (_req, res) => {
      res.send(true);
    });
    await request(app).get('/api/test-rate-limit').expect(200);
    RedisHelper.disconnect();
  });

  it('Should return 429 if API is called too many times', async () => {
    let app;
    let RedisHelper;
    jest.isolateModules(() => {
      require('../../../src/main/bootstrap');
      app = require('../../../src/main/server/app');
      RedisHelper = require('../../../src/infra/helpers/redis-helper');
    });
    app.get('/api/test-rate-limit', (_req, res) => {
      res.send(true);
    });
    await request(app).get('/api/test-rate-limit').expect(200);
    await request(app).get('/api/test-rate-limit').expect(429);
    RedisHelper.disconnect();
  });

  afterAll(() => {
    process.env.RATE_LIMIT_ON = 'false';
  });
});
