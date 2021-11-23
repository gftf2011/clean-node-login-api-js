const MongoHelper = require('../../infra/helpers/mongo-helper');

const {
  MONGO_URL,
  MONGO_DATABASE,
  MONGO_CONNECTION_RETRY,
} = require('../config/env');

module.exports = async () => {
  await new MongoHelper({ attempts: MONGO_CONNECTION_RETRY }).connect(
    MONGO_URL,
    MONGO_DATABASE,
  );
};
