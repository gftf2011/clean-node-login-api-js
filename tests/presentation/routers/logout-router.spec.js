/* eslint-disable max-classes-per-file */

const LogOutRouter = require('../../../src/presentation/routers/logout-router');

const NoTokenProvidedError = require('../../../src/utils/errors/no-token-provided-error');

// Receber o bearer token - (accessToken)
// Verificar o bearer token é válido
// Pegar o id de usuário dentro do bearer token
// Setar o accessToken como nulo a partir do ID

class SutFactory {
  create(_type) {
    this.sut = new LogOutRouter();

    return {
      sut: this.sut,
    };
  }
}

describe('LogOut Router', () => {
  it('Should throw error if no authorization is provided', async () => {
    const { sut } = new SutFactory().create();
    const httpRequest = {
      headers: {},
    };
    const httpResponse = await sut.route(httpRequest);
    expect(httpResponse.statusCode).toBe(401);
    expect(httpResponse.body).toEqual(new NoTokenProvidedError());
  });
});
