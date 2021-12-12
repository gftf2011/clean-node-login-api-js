const MongoHelper = require('../../infra/helpers/mongo-helper');

module.exports = async () => {
  MongoHelper.setRetryConnection(parseInt(process.env.MONGO_CONNECT_RETRY, 10));
  MongoHelper.setRetryDisconnection(
    parseInt(process.env.MONGO_CONNECT_RETRY, 10),
  );
  await MongoHelper.connect(
    process.env.MONGO_URL,
    process.env.MONGO_INITDB_DATABASE,
  );
};
