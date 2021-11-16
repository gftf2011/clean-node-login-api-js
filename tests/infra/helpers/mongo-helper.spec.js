const MongoHelper = require('../../../src/infra/helpers/mongo-helper')

describe('Mongo Helper', () => {
  beforeAll(() => {
    process.env.MONGO_CONNECT_RETRY = '2'
    process.env.MONGO_DISCONNECT_RETRY = '2'
  })

  it('it Should set retryConnect property with default env value when args dependency is not provided', () => {
    const sut = new MongoHelper()
    expect(sut.retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY = '2', 10))
  })

  it('it Should set retryDisconnect property with default env value when args dependencie is not provided', () => {
    const sut = new MongoHelper()
    expect(sut.retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY = '2', 10))
  })

  it('it Should set retryConnect property with default env value when args dependencie is an empty object', () => {
    const sut = new MongoHelper({})
    expect(sut.retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY = '2', 10))
  })

  it('it Should set retryDisconnect property with default env value when args dependencie is an empty object', () => {
    const sut = new MongoHelper({})
    expect(sut.retryDisconnect).toBe(parseInt(process.env.MONGO_DISCONNECT_RETRY = '2', 10))
  })
})
