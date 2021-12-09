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

  it('Should return 200 when valid credentials are provided', async () => {
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password(10, true);
    const hashedPassword = await bcrypt.hash(fakePassword, 8);
    await userModel.insertOne({
      email: fakeEmail,
      password: hashedPassword,
    });
    await request(app)
      .post('/api/login')
      .send({
        email: fakeEmail,
        password: fakePassword,
      })
      .expect(200);
  });

  it('Should return 400 when email is not provided', async () => {
    const fakePassword = faker.internet.password(10, true);
    await request(app)
      .post('/api/login')
      .send({
        password: fakePassword,
      })
      .expect(400);
  });

  it('Should return 400 when password is not provided', async () => {
    const fakeEmail = faker.internet.email();
    await request(app)
      .post('/api/login')
      .send({
        email: fakeEmail,
      })
      .expect(400);
  });

  it('Should return 400 when email provided is not valid', async () => {
    const fakeEmail = faker.internet.email();
    const fakeInvalidEmail = 'invalid_email';
    const fakePassword = faker.internet.password(10, true);
    await userModel.insertOne({
      email: fakeEmail,
      password: fakePassword,
    });
    await request(app)
      .post('/api/login')
      .send({
        email: fakeInvalidEmail,
        password: fakePassword,
      })
      .expect(400);
  });

  it('Should return 401 when password does not match with user found', async () => {
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password(10, true);
    await userModel.insertOne({
      email: fakeEmail,
      password: fakePassword,
    });
    await request(app)
      .post('/api/login')
      .send({
        email: fakeEmail,
        password: fakePassword,
      })
      .expect(401);
  });

  it('Should return 401 when email does not exists', async () => {
    const fakeEmail = faker.internet.email('Rhinos', 'Tadeu');
    const fakeEmail2 = faker.internet.email('Alexander', 'Primus');
    const fakePassword = faker.internet.password(10, true);
    await userModel.insertOne({
      email: fakeEmail,
      password: fakePassword,
    });
    await request(app)
      .post('/api/login')
      .send({
        email: fakeEmail2,
        password: fakePassword,
      })
      .expect(401);
  });

  afterEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
});
