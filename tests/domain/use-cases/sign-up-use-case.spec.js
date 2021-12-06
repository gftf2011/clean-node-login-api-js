const ServerError = require('../../../src/utils/errors/server-error');

const EncrypterSpyFactory = require('../helpers/abstract-factories/spies/encrypter-spy-factory');
const LoadUserByEmailRepositorySpyFactory = require('../helpers/abstract-factories/spies/load-user-by-email-repository-spy-factory');
const InsertUserRepositorySpyFactory = require('../helpers/abstract-factories/spies/insert-user-repository-spy-factory');
const TokenGeneratorSpyFactory = require('../helpers/abstract-factories/spies/token-generator-spy-factory');

const SignUpUseCase = require('../../../src/domain/use-cases/sign-up-use-case');

const SutFactory = require('../helpers/factory-mothods/sign-up-use-case-sut-factory');

const {
  FAKE_GENERIC_USER,
  FAKE_HASHED_PASSWORD,
  FAKE_GENERIC_USER_ID,
  FAKE_GENERIC_ACCESS_TOKEN,
  SIGN_UP_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_ENCRYPTER_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_INSERT_USER_REPOSITORY_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR,
} = require('../helpers/constants');

describe('SignUp UseCase', () => {
  it('Should throw error if no dependency is provided', async () => {
    const sut = new SignUpUseCase();
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no LoadUserByEmailRepository is provided', async () => {
    const sut = new SignUpUseCase({});
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no LoadUserByEmailRepository load method is provided', async () => {
    const sut = new SignUpUseCase({ loadUserByEmailRepository: {} });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no Encrypter is provided', async () => {
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no Encrypter hash method is provided', async () => {
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: {},
    });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no InsertUserRepository is provided', async () => {
    const encrypterSpy = new EncrypterSpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
    });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no InsertUserRepository insert method is provided', async () => {
    const encrypterSpy = new EncrypterSpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      insertUserRepository: {},
    });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no TokenGenerator is provided', async () => {
    const encrypterSpy = new EncrypterSpyFactory().create();
    const insertUserRepositorySpy =
      new InsertUserRepositorySpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      insertUserRepository: insertUserRepositorySpy,
    });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no TokenGenerator generate method is provided', async () => {
    const encrypterSpy = new EncrypterSpyFactory().create();
    const insertUserRepositorySpy =
      new InsertUserRepositorySpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      insertUserRepository: insertUserRepositorySpy,
      tokenGenerator: {},
    });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no UpdateAccessTokenRepository is provided', async () => {
    const tokenGeneratorSpy = new TokenGeneratorSpyFactory().create();
    const encrypterSpy = new EncrypterSpyFactory().create();
    const insertUserRepositorySpy =
      new InsertUserRepositorySpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      insertUserRepository: insertUserRepositorySpy,
      tokenGenerator: tokenGeneratorSpy,
    });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no UpdateAccessTokenRepository update method is provided', async () => {
    const tokenGeneratorSpy = new TokenGeneratorSpyFactory().create();
    const encrypterSpy = new EncrypterSpyFactory().create();
    const insertUserRepositorySpy =
      new InsertUserRepositorySpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      insertUserRepository: insertUserRepositorySpy,
      tokenGenerator: tokenGeneratorSpy,
      updateAccessTokenRepository: {},
    });
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should call Encrypter hash method with correct value', async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } =
      new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    await sut.execute(FAKE_GENERIC_USER);
    expect(encrypterSpy.password).toBe(FAKE_GENERIC_USER.password);
    expect(encrypterSpy.hashedPassword).toBe(FAKE_HASHED_PASSWORD);
  });

  it('Should call InsertUserRepository insert method with correct value', async () => {
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    await sut.execute(FAKE_GENERIC_USER);
    expect(insertUserRepositorySpy.user).toEqual({
      ...FAKE_GENERIC_USER,
      password: encrypterSpy.hashedPassword,
    });
  });

  it('Should call TokenGenerator generate method with correct value', async () => {
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    insertUserRepositorySpy.userId = FAKE_GENERIC_USER_ID;
    tokenGeneratorSpy.accessToken = FAKE_GENERIC_ACCESS_TOKEN;
    await sut.execute(FAKE_GENERIC_USER);
    expect(tokenGeneratorSpy.userId).toBe(FAKE_GENERIC_USER_ID);
  });

  it('Should call LoadUserByEmailRepository load method with correct value', async () => {
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    insertUserRepositorySpy.userId = FAKE_GENERIC_USER_ID;
    tokenGeneratorSpy.accessToken = FAKE_GENERIC_ACCESS_TOKEN;
    await sut.execute(FAKE_GENERIC_USER);
    expect(loadUserByEmailRepositorySpy.email).toBe(FAKE_GENERIC_USER.email);
  });

  it('Should call UpdateAccessTokenRepository update method with correct values', async () => {
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    insertUserRepositorySpy.userId = FAKE_GENERIC_USER_ID;
    tokenGeneratorSpy.accessToken = FAKE_GENERIC_ACCESS_TOKEN;
    await sut.execute(FAKE_GENERIC_USER);
    expect(updateAccessTokenRepositorySpy.userId).toBe(
      insertUserRepositorySpy.userId,
    );
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken,
    );
  });

  it('Should return null if user already exists in database', async () => {
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = {};
    const accessToken = await sut.execute(FAKE_GENERIC_USER);
    expect(accessToken).toBeNull();
  });

  it('Should return accessToken if correct credentials are provided', async () => {
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    insertUserRepositorySpy.userId = FAKE_GENERIC_USER_ID;
    tokenGeneratorSpy.accessToken = FAKE_GENERIC_ACCESS_TOKEN;
    const accessToken = await sut.execute(FAKE_GENERIC_USER);
    expect(accessToken).toEqual(FAKE_GENERIC_ACCESS_TOKEN);
  });

  it('Should throw error if LoadUserByEmailRepository throws error', async () => {
    const { sut } = new SutFactory().create(
      SIGN_UP_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR,
    );
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if Encrypter throws error', async () => {
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create(
      SIGN_UP_USE_CASE_SUT_ENCRYPTER_WITH_ERROR,
    );
    loadUserByEmailRepositorySpy.user = null;
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if InsertUserRepository throws error', async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } =
      new SutFactory().create(
        SIGN_UP_USE_CASE_SUT_INSERT_USER_REPOSITORY_WITH_ERROR,
      );
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if TokenGenerator throws error', async () => {
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
    } = new SutFactory().create(
      SIGN_UP_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR,
    );
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    insertUserRepositorySpy.userId = FAKE_GENERIC_USER_ID;
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if UpdateAccessTokenRepository throws error', async () => {
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
    } = new SutFactory().create(
      SIGN_UP_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR,
    );
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    insertUserRepositorySpy.userId = FAKE_GENERIC_USER_ID;
    tokenGeneratorSpy.accessToken = FAKE_GENERIC_ACCESS_TOKEN;
    const promise = sut.execute(FAKE_GENERIC_USER);
    await expect(promise).rejects.toThrow(new ServerError());
  });
});
