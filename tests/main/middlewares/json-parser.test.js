const request = require('supertest');

jest.mock('../../../src/main/config/routes', () => jest.fn());

const app = require('../../../src/main/server/app');

describe('JSON Parser Middleware', () => {
  it('Should parse JSON request', async () => {
    app.post('/api/test-json-parser', (req, res) => {
      res.send(req.body);
    });
    await request(app)
      .post('/api/test-json-parser')
      .send({ test: true })
      .expect({ test: true });
  });
});
