/* eslint-disable max-classes-per-file */
// Procurar um usuário se ele já existir
// SE existir retorna erro
// SE não existir continue com o fluxo
// Encriptar a senha do usuário E criar o usuário na base de dados
// Procurar pelo usuário para conseguir o ID
// Gerar o token de acesso
// Fazer o update na base do usuário
// E retornar o token de acesso

const EncrypterSpyFactory = require('../helpers/abstract-factories/spies/encrypter-spy-factory');
const LoadUserByEmailRepositorySpyFactory = require('../helpers/abstract-factories/spies/load-user-by-email-repository-spy-factory');

const {
  FAKE_GENERIC_USER,
  FAKE_HASHED_PASSWORD,
} = require('../helpers/constants');

class DependenciesFactory {
  create() {
    this.encrypterSpy = new EncrypterSpyFactory().create();
    this.loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    return {
      encrypterSpy: this.encrypterSpy,
      loadUserByEmailRepositorySpy: this.loadUserByEmailRepositorySpy,
    };
  }
}

class SignUpUseCase {
  constructor({ loadUserByEmailRepository, encrypter } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
    this.encrypter = encrypter;
  }

  // eslint-disable-next-line consistent-return
  async execute(user) {
    const userFound = await this.loadUserByEmailRepository.load(user.email);
    if (userFound) {
      return null;
    }
    const hashedPassword = await this.encrypter.hash(user.password);
    // eslint-disable-next-line no-unused-vars
    const newUser = {
      ...user,
      password: hashedPassword,
    };
  }
}

class SutFactory {
  create(_type) {
    this.dependencies = new DependenciesFactory().create();

    this.sut = new SignUpUseCase({
      loadUserByEmailRepository: this.dependencies.loadUserByEmailRepositorySpy,
      encrypter: this.dependencies.encrypterSpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
}

describe('SignUp UseCase', () => {
  it('Should call Encrypter hash method with correct value', async () => {
    const { sut, encrypterSpy, loadUserByEmailRepositorySpy } =
      new SutFactory().create();
    loadUserByEmailRepositorySpy.user = null;
    encrypterSpy.hashedPassword = FAKE_HASHED_PASSWORD;
    await sut.execute(FAKE_GENERIC_USER);
    expect(encrypterSpy.password).toBe(FAKE_GENERIC_USER.password);
    expect(encrypterSpy.hashedPassword).toBe(FAKE_HASHED_PASSWORD);
  });

  it('Should return null if user already exists in database', async () => {
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = {};
    const accessToken = await sut.execute(FAKE_GENERIC_USER);
    expect(accessToken).toBeNull();
  });
});
