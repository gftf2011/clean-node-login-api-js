require('../../../src/main/bootstrap');
const request = require('supertest');

jest.mock('../../../src/main/config/routes', () => jest.fn());

const app = require('../../../src/main/server/app');

describe('Brute Middleware', () => {
  beforeAll(() => {
    process.env.BRUTE_ON = 'true';
  });

  it('Should return 200 if API is called once', async () => {
    app.get('/api/test-brute', (_req, res) => {
      res.send(true);
    });
    await request(app).get('/api/test-brute').expect(200);
  });

  afterAll(() => {
    process.env.BRUTE_ON = 'false';
  });
});
