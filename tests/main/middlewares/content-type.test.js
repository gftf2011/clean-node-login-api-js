const request = require('supertest');

describe('Content-Type Middleware', () => {
  let app;

  beforeEach(() => {
    jest.resetModules();
    // eslint-disable-next-line global-require
    app = require('../../../src/main/server/app');
  });

  it('Should return json content-type as default', async () => {
    app.get('/api/test-content-type', (_req, res) => {
      res.send('');
    });
    await request(app)
      .get('/api/test-content-type')
      .expect('content-type', /json/);
  });

  it('Should return xml content-type if required', async () => {
    app.get('/api/test-content-type', (_req, res) => {
      res.type('xml');
      res.send('');
    });
    await request(app)
      .get('/api/test-content-type')
      .expect('content-type', /xml/);
  });
});
