const { MongoClient } = require('mongodb')

const ServerError = require('../../../src/utils/errors/server-error')

const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'

class LoadUserByEmailRepository {
  constructor ({ userModel } = {}) {
    this.userModel = userModel
  }

  async load (email) {
    if (!this.userModel || !this.userModel.findOne) {
      throw new ServerError()
    }
    const user = await this.userModel.findOne({ email })
    return user
  }
}

let connection, db

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
  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = connection.db()
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
    await connection.close()
  })
})
