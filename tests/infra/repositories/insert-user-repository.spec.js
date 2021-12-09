/* eslint-disable max-classes-per-file */
require('../../../src/main/bootstrap');

const faker = require('faker');
const fakerBr = require('faker-br');

const ServerError = require('../../../src/utils/errors/server-error');
const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const INSERT_USER_REPOSITORY_SUT_EMPTY = Symbol(
  'INSERT_USER_REPOSITORY_SUT_EMPTY',
);

class InsertUserRepository {
  constructor({ userModel } = {}) {
    this.userModel = userModel;
  }

  async insert(user) {
    if (!this.userModel || !this.userModel.insertOne) {
      throw new ServerError();
    } else if (!user) {
      throw new MissingParamError('user');
    }
    const insertedUser = await this.userModel.insertOne(user);
    return insertedUser.insertedId;
  }
}

class SutFactory {
  constructor(db) {
    this.db = db;
  }

  create(type) {
    this.userModel = this.db.collection('users');

    if (type === INSERT_USER_REPOSITORY_SUT_EMPTY) {
      this.sut = new InsertUserRepository();
    } else {
      this.sut = new InsertUserRepository({ userModel: this.userModel });
    }
    return {
      sut: this.sut,
      userModel: this.userModel,
    };
  }
}

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
    const userModel = db.collection('users');
    const { sut } = new SutFactory(db).create();
    const userId = await sut.insert(fakeUser);
    const userFound = await userModel.findOne({ _id: userId });
    expect(userFound._id).toStrictEqual(userId);
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });
});