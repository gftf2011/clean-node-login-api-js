/* eslint-disable max-classes-per-file */
// Procurar um usuário se ele já existir
// SE existir retorna erro
// SE não existir continue com o fluxo
// Encriptar a senha do usuário E criar o usuário na base de dados
// Procurar pelo usuário para conseguir o ID
// Gerar o token de acesso
// Fazer o update na base do usuário
// E retornar o token de acesso

const LoadUserByEmailRepositorySpyFactory = require('../helpers/abstract-factories/spies/load-user-by-email-repository-spy-factory');

const { FAKE_GENERIC_USER } = require('../helpers/constants');

class DependenciesFactory {
  create() {
    this.loadUserByEmailRepositorySpy =
      new LoadUserByEmailRepositorySpyFactory().create();
    return {
      loadUserByEmailRepositorySpy: this.loadUserByEmailRepositorySpy,
    };
  }
}

class SignUpUseCase {
  constructor({ loadUserByEmailRepository } = {}) {
    this.loadUserByEmailRepository = loadUserByEmailRepository;
  }

  // eslint-disable-next-line consistent-return
  async execute(user) {
    const userFound = await this.loadUserByEmailRepository.load(user.email);
    if (userFound) {
      return null;
    }
  }
}

class SutFactory {
  create(_type) {
    this.dependencies = new DependenciesFactory().create();

    this.sut = new SignUpUseCase({
      loadUserByEmailRepository: this.dependencies.loadUserByEmailRepositorySpy,
    });

    return {
      sut: this.sut,
      ...this.dependencies,
    };
  }
}

describe('SignUp UseCase', () => {
  it('Should return null if user already exists in database', async () => {
    const { sut, loadUserByEmailRepositorySpy } = new SutFactory().create();
    loadUserByEmailRepositorySpy.user = {};
    const accessToken = await sut.execute(FAKE_GENERIC_USER);
    expect(accessToken).toBeNull();
  });
});
