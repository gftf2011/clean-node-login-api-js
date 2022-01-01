jest.mock('../../../src/infra/helpers/mongo-helper', () => ({
  setRetryConnection(retryConnect) {
    this.retryConnect = retryConnect;
  },

  setRetryDisconnection(retryDisconnect) {
    this.retryDisconnect = retryDisconnect;
  },

  async connect(uri, dbName) {
    this.uri = uri;
    this.dbName = dbName;
  },
}));

const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const loader = require('../../../src/main/loader/load');

describe('Loader', () => {
  it('Should load databases when method is called', async () => {
    process.env.MONGO_CONNECT_RETRY = '2';
    process.env.MONGO_URL = 'ssv://mockuri';
    process.env.MONGO_INITDB_DATABASE = 'mockdb';
    await loader();
    expect(MongoHelper.retryConnect).toBe(2);
    expect(MongoHelper.retryDisconnect).toBe(2);
    expect(MongoHelper.uri).toBe(process.env.MONGO_URL);
    expect(MongoHelper.dbName).toBe(process.env.MONGO_INITDB_DATABASE);
  });
});
