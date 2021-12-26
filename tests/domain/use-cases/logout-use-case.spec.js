// Receber o bearer token - (accessToken)
// Verificar o bearer token é válido
// Pegar o id de usuário dentro do bearer token
// Verificar se o usuário existe
// Setar o accessToken como nulo a partir do ID

const faker = require('faker');

const SutFactory = require('../helpers/factory-mothods/logout-use-case-sut-factory');

const LogOutUseCase = require('../../../src/domain/use-cases/logout-use-case');

const ServerError = require('../../../src/utils/errors/server-error');
const MissingParamError = require('../../../src/utils/errors/missing-param-error');

const {
  LOG_OUT_USE_CASE_SUT_LOAD_USER_BY_ID_REPOSITORY_WITH_ERROR,
  LOG_OUT_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR,
} = require('../helpers/constants');

describe('LogOut UseCase', () => {
  it('Should call LoadUserByIdRepository with correct userId', async () => {
    const fakeUserId = faker.datatype.uuid();
    const { sut, loadUserByIdRepositorySpy } = new SutFactory().create();
    await sut.execute(fakeUserId);
    expect(loadUserByIdRepositorySpy.userId).toBe(fakeUserId);
  });

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const fakeUserId = faker.datatype.uuid();
    const { sut, loadUserByIdRepositorySpy, updateAccessTokenRepositorySpy } =
      new SutFactory().create();
    loadUserByIdRepositorySpy.user = {};
    await sut.execute(fakeUserId);
    expect(updateAccessTokenRepositorySpy.accessToken).toBeNull();
    expect(updateAccessTokenRepositorySpy.userId).toBe(fakeUserId);
  });

  it('Should return "false" if LoadUserByIdRepository load returns no user', async () => {
    const fakeUserId = faker.datatype.uuid();
    const { sut, loadUserByIdRepositorySpy } = new SutFactory().create();
    loadUserByIdRepositorySpy.user = null;
    const isLoggedOut = await sut.execute(fakeUserId);
    expect(isLoggedOut).toBeFalsy();
  });

  it('Should return "true" if UpdateAccessTokenRepository updates user accessToken', async () => {
    const fakeUserId = faker.datatype.uuid();
    const { sut, loadUserByIdRepositorySpy } = new SutFactory().create();
    loadUserByIdRepositorySpy.user = {};
    const isLoggedOut = await sut.execute(fakeUserId);
    expect(isLoggedOut).toBeTruthy();
  });

  it('Should throw error if no userId is provided', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.execute();
    await expect(promise).rejects.toThrow(new MissingParamError('userId'));
  });

  it('Should throw error if no dependency is provided', async () => {
    const fakeUserId = faker.datatype.uuid();
    const sut = new LogOutUseCase();
    const promise = sut.execute(fakeUserId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if dependency is an empty object', async () => {
    const fakeUserId = faker.datatype.uuid();
    const sut = new LogOutUseCase({});
    const promise = sut.execute(fakeUserId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if LoadUserByIdRepository is undefined', async () => {
    const fakeUserId = faker.datatype.uuid();
    const sut = new LogOutUseCase({
      loadUserByIdRepository: undefined,
    });
    const promise = sut.execute(fakeUserId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if LoadUserByIdRepository has no load method', async () => {
    const fakeUserId = faker.datatype.uuid();
    const sut = new LogOutUseCase({
      loadUserByIdRepository: {},
    });
    const promise = sut.execute(fakeUserId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if UpdateAccessTokenRepository is undefined', async () => {
    const fakeUserId = faker.datatype.uuid();
    const { loadUserByIdRepositorySpy } = new SutFactory().create();
    const sut = new LogOutUseCase({
      loadUserByIdRepository: loadUserByIdRepositorySpy,
      updateAccessTokenRepository: undefined,
    });
    const promise = sut.execute(fakeUserId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if UpdateAccessTokenRepository has no update method', async () => {
    const fakeUserId = faker.datatype.uuid();
    const { loadUserByIdRepositorySpy } = new SutFactory().create();
    const sut = new LogOutUseCase({
      loadUserByIdRepository: loadUserByIdRepositorySpy,
      updateAccessTokenRepository: {},
    });
    const promise = sut.execute(fakeUserId);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if LoadUserByIdRepository throws error', async () => {
    const fakeUserId = faker.datatype.uuid();
    const { sut, loadUserByIdRepositorySpy, updateAccessTokenRepositorySpy } =
      new SutFactory().create(
        LOG_OUT_USE_CASE_SUT_LOAD_USER_BY_ID_REPOSITORY_WITH_ERROR,
      );
    const spyLoadUserByIdRepository = jest.spyOn(
      loadUserByIdRepositorySpy,
      'load',
    );
    const spyUpdateAccessTokenRepository = jest.spyOn(
      updateAccessTokenRepositorySpy,
      'update',
    );
    const promise = sut.execute(fakeUserId);
    await expect(spyLoadUserByIdRepository).toHaveBeenCalled();
    await expect(spyLoadUserByIdRepository).toHaveBeenCalledTimes(1);
    await expect(spyLoadUserByIdRepository).rejects.toThrow(new ServerError());
    await expect(promise).rejects.toThrow(new ServerError());
    await expect(spyUpdateAccessTokenRepository).not.toHaveBeenCalled();
  });

  it('Should throw error if UpdateAccessTokenRepository throws error', async () => {
    const fakeUserId = faker.datatype.uuid();
    const { sut, loadUserByIdRepositorySpy, updateAccessTokenRepositorySpy } =
      new SutFactory().create(
        LOG_OUT_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR,
      );
    loadUserByIdRepositorySpy.user = {};
    const spyLoadUserByIdRepository = jest.spyOn(
      loadUserByIdRepositorySpy,
      'load',
    );
    const spyUpdateAccessTokenRepository = jest.spyOn(
      updateAccessTokenRepositorySpy,
      'update',
    );
    const promise = sut.execute(fakeUserId);
    await expect(spyLoadUserByIdRepository).toHaveBeenCalled();
    await expect(spyLoadUserByIdRepository).toHaveBeenCalledTimes(1);
    await expect(promise).rejects.toThrow(new ServerError());
    await expect(spyUpdateAccessTokenRepository).toHaveBeenCalled();
    await expect(spyUpdateAccessTokenRepository).toHaveBeenCalledTimes(1);
    await expect(spyUpdateAccessTokenRepository).rejects.toThrow(
      new ServerError(),
    );
  });
});
