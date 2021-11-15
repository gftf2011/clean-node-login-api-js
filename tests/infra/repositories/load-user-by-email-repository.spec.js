const ServerError = require('../../../src/utils/errors/server-error')

const MongoHelper = require('../../../src/infra/helpers/mongo-helper')

const LoadUserByEmailRepository = require('../../../src/infra/repositories/load-user-by-email-repository')

const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'

let db

class SutFactory {
  create () {
    this.userModel = db.collection('users')
    this.sut = new LoadUserByEmailRepository({ userModel: this.userModel })
    return {
      sut: this.sut,
      userModel: this.userModel
    }
  }
}

describe('LoadUserByEmail Repository', () => {
  const mongoHelper = new MongoHelper()

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
    db = mongoHelper.db
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  it('Should return null if no user is found', async () => {
    const { sut } = new SutFactory().create()
    const user = await sut.load(INVALID_FAKE_GENERIC_EMAIL)
    expect(user).toBeNull()
  })

  it('Should return user if an user is found', async () => {
    const { sut, userModel } = new SutFactory().create()
    const fakeUserInsert = await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL
    })
    const fakeUserfound = await userModel.findOne({ _id: fakeUserInsert.insertedId })
    const user = await sut.load(FAKE_GENERIC_EMAIL)
    expect(user).toEqual(fakeUserfound)
  })

  it('Should throw ServerError if no userModel is provided', () => {
    const sut = new LoadUserByEmailRepository()
    const promise = sut.load(FAKE_GENERIC_EMAIL)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw ServerError if userModel has no findOne method', () => {
    const sut = new LoadUserByEmailRepository({})
    const promise = sut.load(FAKE_GENERIC_EMAIL)
    expect(promise).rejects.toThrow(new ServerError())
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })
})
