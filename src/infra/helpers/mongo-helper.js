const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb');
const MongoBuilderSingleton = require('./builders/singletons/mongo-builder-singleton');

const MongoDirector = require('./builders/mongo-director');

module.exports = class MongoHelper {
  constructor(args) {
    this.retryConnect =
      !args || !args.attempts
        ? parseInt(process.env.MONGO_CONNECT_RETRY, 10)
        : args.attempts;
    this.retryDisconnect =
      !args || !args.attempts
        ? parseInt(process.env.MONGO_DISCONNECT_RETRY, 10)
        : args.attempts;
  }

  async connect(uri, dbName) {
    try {
      this.uri = uri;
      this.dbName = dbName;
      const mongo = new MongoDirector();
      const builtMongo = await mongo.construct(
        MongoBuilderSingleton.getInstance(this.uri, this.dbName),
      );
      this.client = builtMongo.client;
      this.db = builtMongo.db;
    } catch (error) {
      if (this.retryConnect > 0) {
        this.retryConnect--;

        await this.connect(uri, dbName);
      } else {
        throw new MongoNotConnectedError(
          'Not possible to connect to MongoDB Driver',
        );
      }
    }
  }

  async disconnect() {
    try {
      await this.client.close();
    } catch (error) {
      if (this.retryDisconnect > 0) {
        this.retryDisconnect--;

        await this.disconnect();
      } else {
        throw new MongoServerClosedError(
          'Not possible to close MongoDB Driver',
        );
      }
    }
  }
};
