const request = require('supertest')

const app = require('../../../src/main/config/app')

describe('App Setup', () => {
  it('Should disable "X-Powered-By" response header', async () => {
    app.get('/api/test-x-powered-by', (_req, res) => {
      res.send('')
    })
    const response = await request(app).get('/api/test-x-powered-by')

    expect(response.headers['x-powered-by']).toBeUndefined()
  })

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
