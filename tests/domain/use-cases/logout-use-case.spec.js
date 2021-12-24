// Receber o bearer token - (accessToken)
// Verificar o bearer token é válido
// Pegar o id de usuário dentro do bearer token
// Verificar se o usuário existe
// Setar o accessToken como nulo a partir do ID

const faker = require('faker');

const SutFactory = require('../helpers/factory-mothods/logout-use-case-sut-factory');

const LogOutUseCase = require('../../../src/domain/use-cases/logout-use-case');
const ServerError = require('../../../src/utils/errors/server-error');

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
});
