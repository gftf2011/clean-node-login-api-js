const ServerError = require('../../../src/utils/errors/server-error')
const MissingParamError = require('../../../src/utils/errors/missing-param-error')

const MongoHelper = require('../../../src/infra/helpers/mongo-helper')

const SutFactory = require('../helpers/factory-methods/sut-factory')

const {
  FAKE_GENERIC_EMAIL,
  INVALID_FAKE_GENERIC_EMAIL,
  LOAD_USER_BY_EMAIL_REPOSITORY_EMPTY_SUT,
  LOAD_USER_BY_EMAIL_REPOSITORY_EMPTY_OBJECT_SUT
} = require('../helpers/constants/constants')

let db

describe('LoadUserByEmail Repository', () => {
  process.env.MONGO_CONNECT_RETRY = '2'
  process.env.MONGO_DISCONNECT_RETRY = '2'

  const mongoHelper = new MongoHelper()

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
    db = mongoHelper.db
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  it('Should return null if no user is found', async () => {
    const { sut } = new SutFactory(db).create()
    const user = await sut.load(INVALID_FAKE_GENERIC_EMAIL)
    expect(user).toBeNull()
  })

  it('Should return user if an user is found', async () => {
    const { sut, userModel } = new SutFactory(db).create()
    const fakeUserInsert = await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL
    })
    const fakeUserfound = await userModel.findOne({ _id: fakeUserInsert.insertedId })
    const user = await sut.load(FAKE_GENERIC_EMAIL)
    expect(user).toEqual(fakeUserfound)
  })

  it('Should throw ServerError if no userModel is provided', () => {
    const { sut } = new SutFactory(db).create(LOAD_USER_BY_EMAIL_REPOSITORY_EMPTY_SUT)
    const promise = sut.load(FAKE_GENERIC_EMAIL)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw ServerError if userModel has no findOne method', () => {
    const { sut } = new SutFactory(db).create(LOAD_USER_BY_EMAIL_REPOSITORY_EMPTY_OBJECT_SUT)
    const promise = sut.load(FAKE_GENERIC_EMAIL)
    expect(promise).rejects.toThrow(new ServerError())
  })

  it('Should throw MissingParamError if no email is provided', () => {
    const { sut } = new SutFactory(db).create()
    const promise = sut.load()
    expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })
})
