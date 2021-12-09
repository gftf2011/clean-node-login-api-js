const faker = require('faker');
const fakerBr = require('faker-br');

const ServerError = require('../../../src/utils/errors/server-error');

const EncrypterSpyFactory = require('../helpers/abstract-factories/spies/encrypter-spy-factory');
const LoadUserByEmailRepositorySpyFactory = require('../helpers/abstract-factories/spies/load-user-by-email-repository-spy-factory');
const InsertUserRepositorySpyFactory = require('../helpers/abstract-factories/spies/insert-user-repository-spy-factory');
const TokenGeneratorSpyFactory = require('../helpers/abstract-factories/spies/token-generator-spy-factory');

const SignUpUseCase = require('../../../src/domain/use-cases/sign-up-use-case');

const SutFactory = require('../helpers/factory-mothods/sign-up-use-case-sut-factory');

const {
  SIGN_UP_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_ENCRYPTER_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_INSERT_USER_REPOSITORY_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR,
} = require('../helpers/constants');

describe('SignUp UseCase', () => {
  it('Should throw error if no dependency is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const sut = new SignUpUseCase();
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no LoadUserByEmailRepository is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const sut = new SignUpUseCase({});
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no LoadUserByEmailRepository load method is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const sut = new SignUpUseCase({ loadUserByEmailRepository: {} });
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no Encrypter is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
    });
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no Encrypter hash method is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: {},
    });
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no InsertUserRepository is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const encrypterSpy = new EncrypterSpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
    });
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no InsertUserRepository insert method is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const encrypterSpy = new EncrypterSpyFactory().create();
    const loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    const sut = new SignUpUseCase({
      loadUserByEmailRepository: loadUserByEmailRepositorySpy,
      encrypter: encrypterSpy,
      insertUserRepository: {},
    });
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no TokenGenerator is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
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
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no TokenGenerator generate method is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
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
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no UpdateAccessTokenRepository is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
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
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if no UpdateAccessTokenRepository update method is provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
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
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should call Encrypter hash method with correct value', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const fakeHashedPassword = faker.internet.password(64, false);
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } =
      new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = fakeHashedPassword;
    await sut.execute(fakeUser);
    expect(encrypterSpy.password).toBe(fakeUser.password);
    expect(encrypterSpy.hashedPassword).toBe(fakeHashedPassword);
  });

  it('Should call InsertUserRepository insert method with correct value', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = faker.internet.password(64, false);
    await sut.execute(fakeUser);
    expect(insertUserRepositorySpy.user).toEqual({
      ...fakeUser,
      password: encrypterSpy.hashedPassword,
    });
  });

  it('Should call TokenGenerator generate method with correct value', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const fakeHashedPassword = faker.internet.password(64, false);
    const fakeUserId = faker.datatype.uuid();
    const fakeAccessToken = faker.datatype.uuid();
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = fakeHashedPassword;
    insertUserRepositorySpy.userId = fakeUserId;
    tokenGeneratorSpy.accessToken = fakeAccessToken;
    await sut.execute(fakeUser);
    expect(tokenGeneratorSpy.userId).toBe(fakeUserId);
  });

  it('Should call LoadUserByEmailRepository load method with correct value', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const fakeHashedPassword = faker.internet.password(64, false);
    const fakeUserId = faker.datatype.uuid();
    const fakeAccessToken = faker.datatype.uuid();
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = fakeHashedPassword;
    insertUserRepositorySpy.userId = fakeUserId;
    tokenGeneratorSpy.accessToken = fakeAccessToken;
    await sut.execute(fakeUser);
    expect(loadUserByEmailRepositorySpy.email).toBe(fakeUser.email);
  });

  it('Should call UpdateAccessTokenRepository update method with correct values', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const fakeHashedPassword = faker.internet.password(64, false);
    const fakeUserId = faker.datatype.uuid();
    const fakeAccessToken = faker.datatype.uuid();
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
      updateAccessTokenRepositorySpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = fakeHashedPassword;
    insertUserRepositorySpy.userId = fakeUserId;
    tokenGeneratorSpy.accessToken = fakeAccessToken;
    await sut.execute(fakeUser);
    expect(updateAccessTokenRepositorySpy.userId).toBe(
      insertUserRepositorySpy.userId,
    );
    expect(updateAccessTokenRepositorySpy.accessToken).toBe(
      tokenGeneratorSpy.accessToken,
    );
  });

  it('Should return null if user already exists in database', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = {};
    const accessToken = await sut.execute(fakeUser);
    expect(accessToken).toBeNull();
  });

  it('Should return accessToken if correct credentials are provided', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const fakeHashedPassword = faker.internet.password(64, false);
    const fakeUserId = faker.datatype.uuid();
    const fakeAccessToken = faker.datatype.uuid();
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
      tokenGeneratorSpy,
    } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = fakeHashedPassword;
    insertUserRepositorySpy.userId = fakeUserId;
    tokenGeneratorSpy.accessToken = fakeAccessToken;
    const accessToken = await sut.execute(fakeUser);
    expect(accessToken).toEqual(fakeAccessToken);
  });

  it('Should throw error if LoadUserByEmailRepository throws error', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const { sut } = new SutFactory().create(
      SIGN_UP_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR,
    );
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if Encrypter throws error', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create(
      SIGN_UP_USE_CASE_SUT_ENCRYPTER_WITH_ERROR,
    );
    loadUserByEmailRepositorySpy.user = null;
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if InsertUserRepository throws error', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const fakeHashedPassword = faker.internet.password(64, false);
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } =
      new SutFactory().create(
        SIGN_UP_USE_CASE_SUT_INSERT_USER_REPOSITORY_WITH_ERROR,
      );
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = fakeHashedPassword;
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if TokenGenerator throws error', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const fakeHashedPassword = faker.internet.password(64, false);
    const fakeUserId = faker.datatype.uuid();
    const {
      sut,
      encrypterSpy,
      loadUserByEmailRepositorySpy,
      insertUserRepositorySpy,
    } = new SutFactory().create(
      SIGN_UP_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR,
    );
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = fakeHashedPassword;
    insertUserRepositorySpy.userId = fakeUserId;
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });

  it('Should throw error if UpdateAccessTokenRepository throws error', async () => {
    const fakeUser = {
      email: faker.internet.email(),
      password: faker.internet.password(10, true),
      cpf: fakerBr.br.cpf(),
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    };
    const fakeHashedPassword = faker.internet.password(64, false);
    const fakeUserId = faker.datatype.uuid();
    const fakeAccessToken = faker.datatype.uuid();
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
    encrypterSpy.hashedPassword = fakeHashedPassword;
    insertUserRepositorySpy.userId = fakeUserId;
    tokenGeneratorSpy.accessToken = fakeAccessToken;
    const promise = sut.execute(fakeUser);
    await expect(promise).rejects.toThrow(new ServerError());
  });
});
