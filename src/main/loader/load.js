const MongoHelper = require('../../infra/helpers/mongo-helper');

const { MONGO_URL, MONGO_DATABASE, MONGO_RETRY } = require('../config/env');

module.exports = async () => {
  MongoHelper.setRetryConnection(MONGO_RETRY);
  MongoHelper.setRetryDisconnection(MONGO_RETRY);
  await MongoHelper.connect(MONGO_URL, MONGO_DATABASE);
};
