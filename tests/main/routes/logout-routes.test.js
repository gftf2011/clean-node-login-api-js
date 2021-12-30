const faker = require('faker');
const request = require('supertest');
const bcrypt = require('bcrypt');

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const app = require('../../../src/main/server/app');
const routes = require('../../../src/main/config/routes');

require('../../../src/main/bootstrap');

describe('Login Routes', () => {
  let db;
  let userModel;

  beforeAll(async () => {
    await MongoHelper.connect(
      process.env.MONGO_URL,
      process.env.MONGO_INITDB_DATABASE,
    );
    db = MongoHelper.getDb();
    userModel = db.collection('users');
    routes(app);
  });

  it('Should return 204 when valid credentials are provided', async () => {
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password(10, true);
    const hashedPassword = await bcrypt.hash(fakePassword, 8);
    await userModel.insertOne({
      email: fakeEmail,
      password: hashedPassword,
    });
    const { text } = await request(app).post('/api/login').send({
      email: fakeEmail,
      password: fakePassword,
    });

    const { accessToken } = JSON.parse(text);

    await request(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(204);
  });

  it('Should return 401 when authorization is not provided', async () => {
    await request(app).post('/api/logout').expect(401);
  });

  afterEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
});
