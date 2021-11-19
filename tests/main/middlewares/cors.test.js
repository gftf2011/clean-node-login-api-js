const request = require('supertest')

const app = require('../../../src/main/server/app')

describe('Cors Middleware', () => {
  it('Should enable CORS', async () => {
    app.get('/api/enable-cors', (_req, res) => {
      res.send('')
    })
    const response = await request(app).get('/api/enable-cors')

    expect(response.headers['access-control-allow-origin']).toBe('*')
    expect(response.headers['access-control-allow-methods']).toBe('*')
    expect(response.headers['access-control-allow-headers']).toBe('*')
  })
})
