const faker = require('faker');
const fakerBr = require('faker-br');
const request = require('supertest');
const bcrypt = require('bcrypt');

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const app = require('../../../src/main/server/app');
const routes = require('../../../src/main/config/routes');

require('../../../src/main/bootstrap');

describe('SignUp Routes', () => {
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
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    await request(app).post('/api/sign-up').send(user).expect(200);
    const userFound = await userModel.findOne({ email: user.email });
    expect(userFound.email).toBe(user.email);
    expect(await bcrypt.compare(user.password, userFound.password)).toBe(true);
    expect(userFound.cpf).toBe(user.cpf);
    expect(userFound.name).toBe(user.name);
  });

  it('Should return 400 when email is not provided', async () => {
    const user = {
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    await request(app).post('/api/sign-up').send(user).expect(400);
  });

  it('Should return 400 when email provided is not valid', async () => {
    const user = {
      email: 'any_invalid_email',
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    await request(app).post('/api/sign-up').send(user).expect(400);
  });

  it('Should return 400 when password is not provided', async () => {
    const user = {
      email: faker.internet.email(),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    await request(app).post('/api/sign-up').send(user).expect(400);
  });

  it('Should return 400 when name is not provided', async () => {
    const user = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
    };
    await request(app).post('/api/sign-up').send(user).expect(400);
  });

  afterEach(async () => {
    await userModel.deleteMany();
  });

  afterAll(async () => {
    await MongoHelper.disconnect();
  });
});
