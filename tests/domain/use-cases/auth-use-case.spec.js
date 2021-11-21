const MissingParamError = require('../../../src/utils/errors/missing-param-error');
const ServerError = require('../../../src/utils/errors/server-error');

const AuthUseCase = require('../../../src/domain/use-cases/auth-use-case');

const SutFactory = require('../helpers/factory-mothods/auth-use-case-sut-factory');

const LoadUserByEmailRepositorySpyFactory = require('../helpers/abstract-factories/spies/load-user-by-email-repository-spy-factory');
const EncrypterSpyFactory = require('../helpers/abstract-factories/spies/encrypter-spy-factory');
const TokenGeneratorSpyFactory = require('../helpers/abstract-factories/spies/token-generator-spy-factory');

const {
  FAKE_GENERIC_ACCESS_TOKEN,
  FAKE_GENERIC_EMAIL,
  FAKE_GENERIC_PASSWORD,
  INVALID_FAKE_GENERIC_EMAIL,
  INVALID_FAKE_GENERIC_PASSWORD,
  LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT,
  ENCRYPTER_WITH_ERROR_SUT,
  TOKEN_GENERATOR_WITH_ERROR_SUT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT,
} = require('../helpers/constants');

describe('Auth UseCase', () => {
  it('Should return null if invalid email is provided', async () => {
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    const accessToken = await sut.execute(
      INVALID_FAKE_GENERIC_EMAIL,
      FAKE_GENERIC_PASSWORD,
    );
    expect(accessToken).toBeNull();
  });

  it('Should return null if invalid password is provided', async () => {
    const { sut, encrypterSpy } = new SutFactory().create();
    encrypterSpy.isValid = false;
    const accessToken = await sut.execute(
      FAKE_GENERIC_EMAIL,
      INVALID_FAKE_GENERIC_PASSWORD,
    );
    expect(accessToken).toBeNull();
  });

  it('Should return an accessToken if correct credentials are provided', async () => {
    const { sut } = new SutFactory().create();
    const accessToken = await sut.execute(
      FAKE_GENERIC_EMAIL,
      FAKE_GENERIC_PASSWORD,
    );
    expect(accessToken).toBe(FAKE_GENERIC_ACCESS_TOKEN);
  });

  it('Should call LoadUserByEmailRepository with correct email', async () => {
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create();
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    expect(FAKE_GENERIC_EMAIL).toBe(loadUserByEmailRepositorySpy.email);
  });

  it('Should call Encrypter with correct values', async () => {
    const { sut, loadUserByEmailRepositorySpy, encrypterSpy } =
      new SutFactory().create();
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    expect(encrypterSpy.password).toBe(FAKE_GENERIC_PASSWORD);
    expect(encrypterSpy.hashedPassword).toBe(
      loadUserByEmailRepositorySpy.user.password,
    );
  });

  it('Should call TokenGenerator with correct userId', async () => {
    const { sut, loadUserByEmailRepositorySpy, tokenGeneratorSpy } =
      new SutFactory().create();
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    expect(tokenGeneratorSpy.userId).toBe(loadUserByEmailRepositorySpy.user.id);
  });

  it('Should call UpdateAccessTokenRepository with correct values', async () => {
    const {
      sut,
      loadUserByEmailRepositorySpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy,
    } = new SutFactory().create();
    await sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    expect(updateAccessTokenRepositorySpy.userId).toBe(
      loadUserByEmailRepositorySpy.user.id,
    );
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken,
    );
  });

  it('Should throw error if no email is provided', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.execute(undefined, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new MissingParamError('email'));
  });

  it('Should throw error if no password is provided', async () => {
    const { sut } = new SutFactory().create();
    const promise = sut.execute(FAKE_GENERIC_EMAIL, undefined);
    await expect(promise).rejects.toThrow(new MissingParamError('password'));
  });

  it('Should throw error if no dependency is provided', async () => {
    const sut = new AuthUseCase();
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no LoadUserByEmailRepository is provided', async () => {
    const sut = new AuthUseCase({});
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if LoadUserByEmailRepository has no load method', async () => {
    const sut = new AuthUseCase({ loadUserByEmailRepository: {} });
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no Encrypter is provided', async () => {
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    });
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if Encrypter has no compare method', async () => {
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: {},
    });
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no TokenGenerator is provided', async () => {
    const encrypterSpy = new EncrypterSpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
    });
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if TokenGenerator has no generate method', async () => {
    const encrypterSpy = new EncrypterSpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: {},
    });
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no UpdateAccessTokenRepository is provided', async () => {
    const encrypterSpy = new EncrypterSpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const tokenGeneratorSpy = new TokenGeneratorSpyFactory().create();
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy,
    });
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if UpdateAccessTokenRepository has no update method', async () => {
    const encrypterSpy = new EncrypterSpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const tokenGeneratorSpy = new TokenGeneratorSpyFactory().create();
    const sut = new AuthUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      tokenGenerator: tokenGeneratorSpy,
      updateAccessTokenRepository: {},
    });
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if LoadUserByEmailRepositorySpy throws error', async () => {
    const { sut } = new SutFactory().create(
      LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT,
    );
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if Encrypter throws error', async () => {
    const { sut } = new SutFactory().create(ENCRYPTER_WITH_ERROR_SUT);
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if TokenGenerator throws error', async () => {
    const { sut } = new SutFactory().create(TOKEN_GENERATOR_WITH_ERROR_SUT);
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if UpdateAccessTokenRepository throws error', async () => {
    const { sut } = new SutFactory().create(
      UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT,
    );
    const promise = sut.execute(FAKE_GENERIC_EMAIL, FAKE_GENERIC_PASSWORD);
    await expect(promise).rejects.toThrow(new ServerError());
  });
});
