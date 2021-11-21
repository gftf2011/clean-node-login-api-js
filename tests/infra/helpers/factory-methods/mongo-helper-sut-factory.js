const MongoHelper = require('../../../../src/infra/helpers/mongo-helper');

const { MONGO_ATTEMPTS_TO_RETRY } = require('../constants');

module.exports = class SutFactory {
  create(type) {
    let sut = new MongoHelper();

    if (type === 'MONGO_HELPER_WITH_EMPTY_ARGS_SUT') {
      sut = new MongoHelper({});
    } else if (type === 'MONGO_HELPER_WITH_ARGS_SUT') {
      sut = new MongoHelper({ attempts: MONGO_ATTEMPTS_TO_RETRY });
    }

    return { sut };
  }
};
