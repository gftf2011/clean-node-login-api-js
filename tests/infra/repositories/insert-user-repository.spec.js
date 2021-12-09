require('../../../src/main/bootstrap');

const faker = require('faker');
const fakerBr = require('faker-br');

const ServerError = require('../../../src/utils/errors/server-error');
const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const SutFactory = require('../helpers/factory-methods/insert-user-repository-sut-factory');

const {
  INSERT_USER_REPOSITORY_SUT_EMPTY,
  INSERT_USER_REPOSITORY_SUT_EMPTY_OBJECT,
  INSERT_USER_REPOSITORY_SUT_EMPTY_USER_MODEL_OBJECT,
} = require('../helpers/constants');

let db;

describe('InsertUser Repository', () => {
  process.env.MONGO_CONNECT_RETRY = '2';
  process.env.MONGO_DISCONNECT_RETRY = '2';

  const mongoHelper = MongoHelper;

  beforeAll(async () => {
    await mongoHelper.connect(
      process.env.MONGO_URL,
      process.env.MONGO_INITDB_DATABASE,
    );
    db = mongoHelper.getDb();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  it('Should return userId after insertion', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const { sut, userModel } = new SutFactory(db).create();
    const userId = await sut.insert(fakeUser);
    const userFound = await userModel.findOne({ _id: userId });
    expect(userFound._id).toStrictEqual(userId);
  });

  it('Should throw MissingParamError if no user is provided', async () => {
    const { sut } = new SutFactory(db).create();
    const promise = sut.insert();
    await expect(promise).rejects.toThrow(new MissingParamError('user'));
  });

  it('Should throw ServerError if no userModel is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const { sut } = new SutFactory(db).create(INSERT_USER_REPOSITORY_SUT_EMPTY);
    const promise = sut.insert(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if userModel has been provided in the dependencies as undefined', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const { sut } = new SutFactory(db).create(
      INSERT_USER_REPOSITORY_SUT_EMPTY_OBJECT,
    );
    const promise = sut.insert(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if userModel has no insertOne method', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const { sut } = new SutFactory(db).create(
      INSERT_USER_REPOSITORY_SUT_EMPTY_USER_MODEL_OBJECT,
    );
    const promise = sut.insert(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });
});
