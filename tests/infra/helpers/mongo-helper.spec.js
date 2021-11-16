const MongoHelper = require('../../../src/infra/helpers/mongo-helper')

const MONGO_ATTEMPTS_TO_RETRY = 3
const MONGO_FAKE_URI = 'any_uri'
const MONGO_FAKE_DATABASE_NAME = 'any_database'

jest.mock('../../../src/infra/helpers/directors/driver.js', () => {
  return jest.fn().mockImplementation(() => {
    return {
      construct: async (_builder) => {
        return {
          client: {
            close: async () => {}
          },
          db: {}
        }
      }
    }
  })
})

describe('Mongo Helper', () => {
  beforeAll(() => {
    process.env.MONGO_CONNECT_RETRY = '2'
    process.env.MONGO_DISCONNECT_RETRY = '2'
  })

  it('Should set retryConnect property with default env value when args dependency is not provided', () => {
    const sut = new MongoHelper()
    expect(sut.retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY = '2', 10))
  })

  it('Should set retryDisconnect property with default env value when args dependency is not provided', () => {
    const sut = new MongoHelper()
    expect(sut.retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY = '2', 10))
  })

  it('Should set retryConnect property with default env value when args dependency is an empty object', () => {
    const sut = new MongoHelper({})
    expect(sut.retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY = '2', 10))
  })

  it('Should set retryDisconnect property with default env value when args dependency is an empty object', () => {
    const sut = new MongoHelper({})
    expect(sut.retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY = '2', 10))
  })

  it('Should set retryConnect property with correct value when args dependency is provided', () => {
    const sut = new MongoHelper({ attempts: MONGO_ATTEMPTS_TO_RETRY })
    expect(sut.retryConnect).toBe(MONGO_ATTEMPTS_TO_RETRY)
  })

  it('Should set retryDisconnect property with correct value when args dependency is provided', () => {
    const sut = new MongoHelper({ attempts: MONGO_ATTEMPTS_TO_RETRY })
    expect(sut.retryDisconnect).toBe(MONGO_ATTEMPTS_TO_RETRY)
  })

  it('Should build client and db if Driver constructed with success', async () => {
    const sut = new MongoHelper({ attempts: MONGO_ATTEMPTS_TO_RETRY })
    await sut.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME)

    expect(sut.client).toHaveProperty('close')
    expect(sut.db).toEqual({})
  })
})
