/* eslint-disable max-classes-per-file */
const ServerError = require('../../../src/utils/errors/server-error');

const EncrypterSpyFactory = require('../helpers/abstract-factories/spies/encrypter-spy-factory');
const LoadUserByEmailRepositorySpyFactory = require('../helpers/abstract-factories/spies/load-user-by-email-repository-spy-factory');
const InsertUserRepositorySpyFactory = require('../helpers/abstract-factories/spies/insert-user-repository-spy-factory');
const TokenGeneratorSpyFactory = require('../helpers/abstract-factories/spies/token-generator-spy-factory');
const UpdateAccessTokenRepositorySpyFactory = require('../helpers/abstract-factories/spies/update-access-token-repository-spy-factory');

const {
  FAKE_GENERIC_USER,
  FAKE_HASHED_PASSWORD,
  FAKE_GENERIC_USER_ID,
  FAKE_GENERIC_ACCESS_TOKEN,
  SIGN_UP_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_ENCRYPTER_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_INSERT_USER_REPOSITORY_WITH_ERROR,
  SIGN_UP_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR,
} = require('../helpers/constants');

class DependenciesFactory {
  create() {
    this.encrypterSpy = new EncrypterSpyFactory().create();
    this.loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    this.insertUserRepositorySpy =
      new InsertUserRepositorySpyFactory().create();
    this.tokenGeneratorSpy = new TokenGeneratorSpyFactory().create();
    this.updateAccessTokenRepositorySpy =
      new UpdateAccessTokenRepositorySpyFactory().create();
    return {
      encrypterSpy: this.encrypterSpy,
      loadUserByEmailRepositorySpy: this.loadUserByEmailRepositorySpy,
      insertUserRepositorySpy: this.insertUserRepositorySpy,
      tokenGeneratorSpy: this.tokenGeneratorSpy,
      updateAccessTokenRepositorySpy: this.updateAccessTokenRepositorySpy,
    };
  }
}

class SignUpUseCase {
  constructor({
    updateAccessTokenRepository,
    loadUserByEmailRepository,
    insertUserRepository,
    tokenGenerator,
    encrypter,
  } = {}) {
    this.updateAccessTokenRepository = updateAccessTokenRepository;
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.insertUserRepository = insertUserRepository;
    this.tokenGenerator = tokenGenerator;
    this.encrypter = encrypter;
  }

  async execute(user) {
    if (
      !this.loadUserByEmailRepository ||
      !this.loadUserByEmailRepository.load ||
      !this.encrypter ||
      !this.encrypter.hash ||
      !this.insertUserRepository ||
      !this.insertUserRepository.insert ||
      !this.tokenGenerator ||
      !this.tokenGenerator.generate ||
      !this.updateAccessTokenRepository ||
      !this.updateAccessTokenRepository.update
    ) {
      throw new ServerError();
    }
    const userFound = await this.loadUserByEmailRepository.load(user.email);
    if (userFound) {
      return null;
    }
    const hashedPassword = await this.encrypter.hash(user.password);
    const newUser = {
      ...user,
      password: hashedPassword,
    };
    const userId = await this.insertUserRepository.insert(newUser);
    const accessToken = await this.tokenGenerator.generate(userId);
    await this.updateAccessTokenRepository.update(userId, accessToken);
    return accessToken;
  }
}

class SutFactory {
  create(type) {
    this.dependencies = new DependenciesFactory().create();

    if (
      type === SIGN_UP_USE_CASE_SUT_LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR
    ) {
      this.dependencies.loadUserByEmailRepositorySpy.load = () => {
        throw new ServerError();
      };
    } else if (type === SIGN_UP_USE_CASE_SUT_ENCRYPTER_WITH_ERROR) {
      this.dependencies.encrypterSpy.hash = () => {
        throw new ServerError();
      };
    } else if (
      type === SIGN_UP_USE_CASE_SUT_INSERT_USER_REPOSITORY_WITH_ERROR
    ) {
      this.dependencies.insertUserRepositorySpy.insert = () => {
        throw new ServerError();
      };
    } else if (type === SIGN_UP_USE_CASE_SUT_TOKEN_GENERATOR_WITH_ERROR) {
      this.dependencies.tokenGeneratorSpy.generate = () => {
        throw new ServerError();
      };
    }

    this.sut = new SignUpUseCase({
      updateAccessTokenRepository:
        this.dependencies.updateAccessTokenRepositorySpy,
      loadUserByEmailRepository: this.dependencies.loadUserByEmailRepositorySpy,
      insertUserRepository: this.dependencies.insertUserRepositorySpy,
      encrypter: this.dependencies.encrypterSpy,
      tokenGenerator: this.dependencies.tokenGeneratorSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
}

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
});
