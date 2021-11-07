const FAKE_GENERIC_PASSWORD = 'any_password'
const FAKE_GENERIC_EMAIL = 'test@gmail.com'

class LoginRouter {
  route (httpRequest) {
    if (!httpRequest.body.email) {
      return {
        statusCode: 400
      }
    } else if (!httpRequest.body.password) {
      return {
        statusCode: 401
      }
    }
  }
}

describe('Login Router', () => {
  it('Should return 400 if no "email" is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        password: FAKE_GENERIC_PASSWORD
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
  })

  it('Should return 401 if no "password" is provided', () => {
    const sut = new LoginRouter()
    const httpRequest = {
      body: {
        email: FAKE_GENERIC_EMAIL
      }
    }
    const httpResponse = sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(401)
  })
})
