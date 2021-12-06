const ServerError = require('../../utils/errors/server-error');

module.exports = class SignUpUseCase {
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
};
