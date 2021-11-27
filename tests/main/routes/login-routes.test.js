const request = require('supertest');
const bcrypt = require('bcrypt');

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const app = require('../../../src/main/server/app');
const routes = require('../../../src/main/config/routes');

require('../../../src/main/bootstrap');

const {
  FAKE_GENERIC_EMAIL,
  FAKE_GENERIC_EMAIL2,
  FAKE_GENERIC_PASSWORD,
  FAKE_INVALID_EMAIL,
} = require('./helpers/constants');

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
    const hashedPassword = await bcrypt.hash(FAKE_GENERIC_PASSWORD, 8);
    await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL,
      password: hashedPassword,
    });
    await request(app)
      .post('/api/login')
      .send({
        email: FAKE_GENERIC_EMAIL,
        password: FAKE_GENERIC_PASSWORD,
      })
      .expect(200);
  });

  it('Should return 400 when email is not provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        password: FAKE_GENERIC_PASSWORD,
      })
      .expect(400);
  });

  it('Should return 400 when password is not provided', async () => {
    await request(app)
      .post('/api/login')
      .send({
        email: FAKE_GENERIC_EMAIL,
      })
      .expect(400);
  });

  it('Should return 400 when email provided is not valid', async () => {
    await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL,
      password: FAKE_GENERIC_PASSWORD,
    });
    await request(app)
      .post('/api/login')
      .send({
        email: FAKE_INVALID_EMAIL,
        password: FAKE_GENERIC_PASSWORD,
      })
      .expect(400);
  });

  it('Should return 401 when password does not match with user found', async () => {
    await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL,
      password: FAKE_GENERIC_PASSWORD,
    });
    await request(app)
      .post('/api/login')
      .send({
        email: FAKE_GENERIC_EMAIL,
        password: FAKE_GENERIC_PASSWORD,
      })
      .expect(401);
  });

  it('Should return 401 when email does not exists', async () => {
    await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL,
      password: FAKE_GENERIC_PASSWORD,
    });
    await request(app)
      .post('/api/login')
      .send({
        email: FAKE_GENERIC_EMAIL2,
        password: FAKE_GENERIC_PASSWORD,
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
