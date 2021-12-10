require('../../../src/main/bootstrap');
const request = require('supertest');

jest.mock('../../../src/main/config/routes', () => jest.fn());

const app = require('../../../src/main/server/app');

describe('Morgan Logger Middleware', () => {
  it('Should log request', async () => {
    process.env.LOGGER_ON = 'true';
    process.env.LOGGER_SKIP = 'true';

    app.post('/api/test-logger', (req, res) => {
      res.send(req.body);
    });

    await request(app)
      .post('/api/test-logger')
      .send({ test: true })
      .expect({ test: true });
  });
});
