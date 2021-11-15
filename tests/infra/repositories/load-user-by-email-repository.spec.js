const { MongoClient } = require('mongodb')

const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com'

class LoadUserByEmailRepository {
  constructor ({ userModel }) {
    this.userModel = userModel
  }

  async load (email) {
    const user = await this.userModel.findOne({ email })
    return user
  }
}

describe('LoadUserByEmail Repository', () => {
  let connection, db

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
    const userModel = db.collection('users')
    const sut = new LoadUserByEmailRepository({ userModel })
    const user = await sut.load(INVALID_FAKE_GENERIC_EMAIL)
    expect(user).toBeNull()
  })

  it('Should return user if an user is found', async () => {
    const userModel = db.collection('users')
    await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL
    })
    const sut = new LoadUserByEmailRepository({ userModel })
    const user = await sut.load(FAKE_GENERIC_EMAIL)
    expect(user.email).toBe(FAKE_GENERIC_EMAIL)
  })

  afterAll(async () => {
    await connection.close()
  })
})
