const MongoHelper = require('../../../src/infra/helpers/mongo-helper')

let db, userModel

class UpdateAccessTokenRepository {
  constructor ({ userModel } = {}) {
    this.userModel = userModel
  }

  async update (userId, accessToken) {
    await this.userModel.updateOne({
      _id: userId
    },
    {
      $set: {
        accessToken
      }
    })
  }
}

const FAKE_GENERIC_EMAIL = 'test@gmail.com'
const FAKE_GENERIC_ACCESS_TOKEN = 'any_token'

describe('UpdateAccessToken Repository', () => {
  process.env.MONGO_CONNECT_RETRY = '2'
  process.env.MONGO_DISCONNECT_RETRY = '2'

  const mongoHelper = new MongoHelper()

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL)
    db = mongoHelper.db
    userModel = db.collection('users')
  })

  beforeEach(async () => {
    await db.collection('users').deleteMany()
  })

  it('Should update the user with the properly given access token', async () => {
    const sut = new UpdateAccessTokenRepository({ userModel })
    const fakeUserInsert = await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL
    })
    const userFound = await userModel.findOne({ _id: fakeUserInsert.insertedId })
    await sut.update(userFound._id, FAKE_GENERIC_ACCESS_TOKEN)
    const userFoundUpdated = await userModel.findOne({ _id: userFound._id })
    expect(userFoundUpdated.accessToken).toBe(FAKE_GENERIC_ACCESS_TOKEN)
  })

  afterAll(async () => {
    await mongoHelper.disconnect()
  })
})
