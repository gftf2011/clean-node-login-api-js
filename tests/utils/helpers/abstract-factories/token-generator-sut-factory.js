const faker = require('faker');
const TokenGenerator = require('../../../../src/utils/generators/token-generator');

module.exports = class SutFactory {
  create() {
    this.sut = new TokenGenerator({ secret: faker.datatype.uuid() });
    return { sut: this.sut };
  }
};
