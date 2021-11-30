/* eslint-disable max-classes-per-file */
// Procurar um usuário se ele já existir
// SE existir retorna erro
// SE não existir continue com o fluxo
// Encriptar a senha do usuário
// Criar o usuário na base de dados e retornar o ID
// Gerar o token de acesso
// Fazer o update na base do usuário
// E retornar o token de acesso
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
      !this.tokenGenerator
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
  create(_type) {
    this.dependencies = new DependenciesFactory().create();

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
});
