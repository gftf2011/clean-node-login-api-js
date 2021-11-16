const MongoHelper = require('../../../src/infra/helpers/mongo-helper')

const Driver = require('../../../src/infra/helpers/directors/driver')

const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb')

const MONGO_ATTEMPTS_TO_RETRY = 3
const MONGO_FAKE_URI = 'any_uri'
const MONGO_FAKE_DATABASE_NAME = 'any_database'

jest.mock('../../../src/infra/helpers/directors/driver')

describe('Mongo Helper', () => {
  beforeAll(() => {
    process.env.MONGO_CONNECT_RETRY = '2'
    process.env.MONGO_DISCONNECT_RETRY = '2'

    Driver.mockImplementation(() => {
      return {
        construct: async (_builder) => {
          return {
            client: {
              close: jest.fn()
            },
            db: {}
          }
        }
      }
    })
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

  it('Should build client and db if connect was called with success', async () => {
    const sut = new MongoHelper({ attempts: MONGO_ATTEMPTS_TO_RETRY })
    await sut.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME)
    expect(sut.client).toHaveProperty('close')
    expect(sut.db).toEqual({})
  })

  it('Should build client and db if connect was called with success after first retry attempt', async () => {
    Driver.mockImplementationOnce(() => {
      return {
        construct: async (_builder) => {
          throw new Error()
        }
      }
    }).mockImplementationOnce(() => {
      return {
        construct: async (_builder) => {
          return {
            client: {
              close: jest.fn()
            },
            db: {}
          }
        }
      }
    })
    const sut = new MongoHelper()
    const retryConnect = sut.retryConnect
    const retryDisconnect = sut.retryDisconnect
    await sut.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME)
    expect(retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY, 10))
    expect(retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY, 10))
    expect(sut.retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY, 10) - 1)
    expect(sut.retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY, 10))
    expect(sut.client).toHaveProperty('close')
    expect(sut.db).toEqual({})
  })

  it('Should call client close method in disconnect after connect was called with success', async () => {
    const sut = new MongoHelper({ attempts: MONGO_ATTEMPTS_TO_RETRY })
    await sut.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME)
    await sut.disconnect()
    expect(sut.client).toHaveProperty('close')
    expect(sut.client.close).toHaveBeenCalled()
  })

  it('Should throw MongoNotConnectedError if connection retry fails', async () => {
    Driver.mockImplementationOnce(() => {
      return {
        construct: async (_builder) => {
          throw new Error()
        }
      }
    })
    const sut = new MongoHelper()
    const retryConnect = sut.retryConnect
    const retryDisconnect = sut.retryDisconnect
    try {
      await sut.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME)
    } catch (error) {
      expect(retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY, 10))
      expect(retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY, 10))
      expect(sut.retryConnect).toBe(0)
      expect(sut.retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY, 10))
      expect(error).toEqual(new MongoNotConnectedError('Not possible to connect to MongoDB Driver'))
    }
  })

  it('Should throw MongoServerClosedError if disconnection retry fails', async () => {
    Driver.mockImplementation(() => {
      return {
        construct: async (_builder) => {
          return {
            client: {
              close: async () => {
                throw new Error()
              }
            },
            db: {}
          }
        }
      }
    })
    const sut = new MongoHelper()
    const retryConnect = sut.retryConnect
    const retryDisconnect = sut.retryDisconnect
    await sut.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME)
    try {
      await sut.disconnect()
    } catch (error) {
      expect(retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY, 10))
      expect(retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY, 10))
      expect(sut.retryConnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY, 10))
      expect(sut.retryDisconnect).toBe(0)
      expect(error).toEqual(new MongoServerClosedError('Not possible to close MongoDB Driver'))
    }
  })
})
