require('../../../src/main/bootstrap');

const faker = require('faker');

const ServerError = require('../../../src/utils/errors/server-error');
const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const UpdateAccessTokenRepository = require('../../../src/infra/repositories/update-access-token-repository');

const SutFactory = require('../helpers/factory-methods/update-access-token-repository-sut-factory');

let db;

const {
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY,
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY_OBJECT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT,
} = require('../helpers/constants');

describe('UpdateAccessToken Repository', () => {
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

  it('Should update the user with the properly given access token', async () => {
    const fakeEmail = faker.internet.email();
    const fakePassword = faker.internet.password(10, true);
    const fakeAccessToken = faker.datatype.uuid();
    const userModel = db.collection('users');
    const { sut } = new SutFactory(db).create();
    const fakeUserInsert = await userModel.insertOne({
      email: fakeEmail,
      password: fakePassword,
    });
    const userFound = await userModel.findOne({
      _id: fakeUserInsert.insertedId,
    });
    await sut.update(userFound._id, fakeAccessToken);
    const userFoundUpdated = await userModel.findOne({ _id: userFound._id });
    expect(userFoundUpdated.accessToken).toBe(fakeAccessToken);
  });

  it('Should throw ServerError if no dependency is provided', async () => {
    const fakeUserId = faker.datatype.uuid();
    const fakeAccessToken = faker.datatype.uuid();
    const { sut } = new SutFactory(db).create(
      UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY,
    );
    const promise = sut.update(fakeUserId, fakeAccessToken);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if no userModel is provided', async () => {
    const fakeUserId = faker.datatype.uuid();
    const fakeAccessToken = faker.datatype.uuid();
    const { sut } = new SutFactory(db).create(
      UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY_OBJECT,
    );
    const promise = sut.update(fakeUserId, fakeAccessToken);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if userModel provided has no updateOne method', async () => {
    const fakeUserId = faker.datatype.uuid();
    const fakeAccessToken = faker.datatype.uuid();
    const { sut } = new SutFactory(db).create(
      UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT,
    );
    const promise = sut.update(fakeUserId, fakeAccessToken);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw MissingParamError if userId was not provided', async () => {
    const userModel = db.collection('users');
    const sut = new UpdateAccessTokenRepository({ userModel });
    const promise = sut.update();
    await expect(promise).rejects.toThrow(new MissingParamError('userId'));
  });

  it('Should throw MissingParamError if accessToken was not provided', async () => {
    const fakeUserId = faker.datatype.uuid();
    const userModel = db.collection('users');
    const sut = new UpdateAccessTokenRepository({ userModel });
    const promise = sut.update(fakeUserId);
    await expect(promise).rejects.toThrow(new MissingParamError('accessToken'));
  });

  it('Should throw MissingParamError if accessToken is null', async () => {
    const fakeUserId = faker.datatype.uuid();
    const userModel = db.collection('users');
    const sut = new UpdateAccessTokenRepository({ userModel });
    const promise = sut.update(fakeUserId, null);
    await expect(promise).rejects.toThrow(new MissingParamError('accessToken'));
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });
});
