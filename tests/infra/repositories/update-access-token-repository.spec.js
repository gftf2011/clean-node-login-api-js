const ServerError = require('../../../src/utils/errors/server-error');
const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const UpdateAccessTokenRepository = require('../../../src/infra/repositories/update-access-token-repository');

const SutFactory = require('../helpers/factory-methods/update-access-token-repository-sut-factory');

let db;

const {
  FAKE_GENERIC_USER_ID,
  FAKE_GENERIC_EMAIL,
  FAKE_GENERIC_PASSWORD,
  FAKE_GENERIC_ACCESS_TOKEN,
  UPDATE_ACCESS_TOKEN_REPOSITORY_EMPTY_SUT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_EMPTY_OBJECT_SUT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_EMPTY_USER_MODEL_OBJECT_SUT,
} = require('../helpers/constants');

describe('UpdateAccessToken Repository', () => {
  process.env.MONGO_CONNECT_RETRY = '2';
  process.env.MONGO_DISCONNECT_RETRY = '2';

  const mongoHelper = MongoHelper;

  beforeAll(async () => {
    await mongoHelper.connect(process.env.MONGO_URL);
    db = mongoHelper.getDb();
  });

  beforeEach(async () => {
    await db.collection('users').deleteMany();
  });

  it('Should update the user with the properly given access token', async () => {
    const userModel = db.collection('users');
    const { sut } = new SutFactory(db).create();
    const fakeUserInsert = await userModel.insertOne({
      email: FAKE_GENERIC_EMAIL,
      password: FAKE_GENERIC_PASSWORD,
    });
    const userFound = await userModel.findOne({
      _id: fakeUserInsert.insertedId,
    });
    await sut.update(userFound._id, FAKE_GENERIC_ACCESS_TOKEN);
    const userFoundUpdated = await userModel.findOne({ _id: userFound._id });
    expect(userFoundUpdated.accessToken).toBe(FAKE_GENERIC_ACCESS_TOKEN);
  });

  it('Should throw ServerError if no dependency is provided', async () => {
    const { sut } = new SutFactory(db).create(
      UPDATE_ACCESS_TOKEN_REPOSITORY_EMPTY_SUT,
    );
    const promise = sut.update(FAKE_GENERIC_USER_ID, FAKE_GENERIC_ACCESS_TOKEN);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if no userModel is provided', async () => {
    const { sut } = new SutFactory(db).create(
      UPDATE_ACCESS_TOKEN_REPOSITORY_EMPTY_OBJECT_SUT,
    );
    const promise = sut.update(FAKE_GENERIC_USER_ID, FAKE_GENERIC_ACCESS_TOKEN);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw ServerError if userModel provided has no updateOne method', async () => {
    const { sut } = new SutFactory(db).create(
      UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_EMPTY_USER_MODEL_OBJECT_SUT,
    );
    const promise = sut.update(FAKE_GENERIC_USER_ID, FAKE_GENERIC_ACCESS_TOKEN);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw MissingParamError if userId was not provided', async () => {
    const userModel = db.collection('users');
    const sut = new UpdateAccessTokenRepository({ userModel });
    const promise = sut.update();
    await expect(promise).rejects.toThrow(new MissingParamError('userId'));
  });

  it('Should throw MissingParamError if accessToken was not provided', async () => {
    const userModel = db.collection('users');
    const sut = new UpdateAccessTokenRepository({ userModel });
    const promise = sut.update(FAKE_GENERIC_USER_ID);
    await expect(promise).rejects.toThrow(new MissingParamError('accessToken'));
  });

  afterAll(async () => {
    await mongoHelper.disconnect();
  });
});
