const request = require('supertest');

const app = require('../../../src/main/server/app');

describe('Content-Type Middleware', () => {
  it('Should return json content-type as default', async () => {
    app.get('/api/test-content-type', (_req, res) => {
      res.send('');
    });
    await request(app)
      .get('/api/test-content-type')
      .expect('content-type', /json/);
  });

  it('Should return xml content-type if required', async () => {
    app.get('/api/test-content-type-xml', (_req, res) => {
      res.type('xml');
      res.send('');
    });
    await request(app)
      .get('/api/test-content-type-xml')
      .expect('content-type', /xml/);
  });
});
