const { ObjectId } = require('mongodb');

require('../../../src/main/bootstrap');

const faker = require('faker');

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const {
  LOAD_USER_BY_ID_REPOSITORY_SUT_EMPTY,
  LOAD_USER_BY_ID_REPOSITORY_SUT_EMPTY_OBJECT,
  LOAD_USER_BY_ID_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT,
} = require('../helpers/constants');

const ServerError = require('../../../src/utils/errors/server-error');

const SutFactory = require('../helpers/factory-methods/load-user-by-id-repository-sut-factory');
const MissingParamError = require('../../../src/utils/errors/missing-param-error');

let db;

describe('LoadUserById Repository', () => {
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

  it('Should return null if no user is found', async () => {
    const fakeId = new ObjectId();
    const { sut } = new SutFactory(db).create();
    const user = await sut.load(fakeId);
    expect(user).toBeNull();
  });

  it('Should return user if an user is found', async () => {
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password(10, true);
    const { sut, userModel } = new SutFactory(db).create();
    const fakeUserInsert = await userModel.insertOne({
      email: fakeEmail,
      password: fakePassword,
    });
    const fakeUserfound = await userModel.findOne({
      _id: fakeUserInsert.insertedId,
    });
    const user = await sut.load(fakeUserInsert.insertedId);
    expect(user).toEqual(fakeUserfound);
  });

  it('Should throw ServerError if no userModel is provided', async () => {
    const fakeId = faker.datatype.uuid();
    const { sut } = new SutFactory(db).create(
      LOAD_USER_BY_ID_REPOSITORY_SUT_EMPTY,
    );
    const promise = sut.load(fakeId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if userModel has been provided in the dependencies as empty object', async () => {
    const fakeId = faker.datatype.uuid();
    const { sut } = new SutFactory(db).create(
      LOAD_USER_BY_ID_REPOSITORY_SUT_EMPTY_OBJECT,
    );
    const promise = sut.load(fakeId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if userModel has no findOne method', async () => {
    const fakeId = faker.datatype.uuid();
    const { sut } = new SutFactory(db).create(
      LOAD_USER_BY_ID_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT,
    );
    const promise = sut.load(fakeId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw MissingParamError if no id is provided', async () => {
    const { sut } = new SutFactory(db).create();
    const promise = sut.load();
    await expect(promise).rejects.toThrow(new MissingParamError('id'));
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });
});
