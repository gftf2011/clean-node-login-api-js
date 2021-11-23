const { MongoNotConnectedError, MongoServerClosedError } = require('mongodb');
const NoError = require('./errors/no-error');
const MongoDirector = require('../../../src/infra/helpers/builders/mongo-director');
const MongoHelper = require('../../../src/infra/helpers/mongo-helper');

const {
  MONGO_ATTEMPTS_TO_RETRY,
  MONGO_FAKE_URI,
  MONGO_FAKE_DATABASE_NAME,
} = require('./constants');

jest.mock('../../../src/infra/helpers/builders/mongo-director');

const getError = async call => {
  try {
    await call();

    throw new NoError();
  } catch (error) {
    return error;
  }
};

describe('Mongo Helper', () => {
  beforeAll(async () => {
    process.env.MONGO_CONNECT_RETRY = '2';
    process.env.MONGO_DISCONNECT_RETRY = '2';
  });

  beforeEach(() => {
    MongoDirector.mockImplementation(() => {
      return {
        construct: async _builder => {
          return {
            client: {
              close: jest.fn(),
            },
            db: {},
          };
        },
      };
    });
  });

  it('Should set retryConnect property with default env value when args dependency is not provided', () => {
    MongoHelper.setRetryConnection();
    expect(MongoHelper.getRetryConnect()).toBe(
      parseInt((process.env.MONGO_CONNECT_RETRY = '2'), 10),
    );
  });

  it('Should set retryDisconnect property with default env value when args dependency is not provided', () => {
    MongoHelper.setRetryDisconnection();
    expect(MongoHelper.getRetryDisconnect()).toBe(
      parseInt((process.env.MONGO_DISCONNECT_RETRY = '2'), 10),
    );
  });

  it('Should set retryConnect property with correct value when args dependency is provided', () => {
    MongoHelper.setRetryConnection(MONGO_ATTEMPTS_TO_RETRY);
    expect(MongoHelper.getRetryConnect()).toBe(MONGO_ATTEMPTS_TO_RETRY);
  });

  it('Should set retryDisconnect property with correct value when args dependency is provided', () => {
    MongoHelper.setRetryDisconnection(MONGO_ATTEMPTS_TO_RETRY);
    expect(MongoHelper.getRetryDisconnect()).toBe(MONGO_ATTEMPTS_TO_RETRY);
  });

  it('Should build client and db if connect was called with success', async () => {
    MongoHelper.setRetryConnection(MONGO_ATTEMPTS_TO_RETRY);
    MongoHelper.setRetryDisconnection(MONGO_ATTEMPTS_TO_RETRY);
    const connectionError = await getError(async () =>
      MongoHelper.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME),
    );
    const disconnectionError = await getError(async () =>
      MongoHelper.disconnect(),
    );
    expect(connectionError).toEqual(new NoError());
    expect(disconnectionError).toEqual(new NoError());
    expect(MongoHelper.getClient()).toHaveProperty('close');
    expect(MongoHelper.getDb()).toEqual({});
  });

  it('Should build client and db if connect was called with success after first retry attempt', async () => {
    MongoDirector.mockImplementationOnce(() => {
      return {
        construct: async _builder => {
          throw new Error();
        },
      };
    }).mockImplementationOnce(() => {
      return {
        construct: async _builder => {
          return {
            client: {
              close: jest.fn(),
            },
            db: {},
          };
        },
      };
    });
    MongoHelper.setRetryConnection();
    MongoHelper.setRetryDisconnection();
    const retryConnect = MongoHelper.getRetryConnect();
    const retryDisconnect = MongoHelper.getRetryDisconnect();
    const connectionError = await getError(async () =>
      MongoHelper.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME),
    );
    const disconnectionError = await getError(async () =>
      MongoHelper.disconnect(),
    );
    expect(connectionError).toEqual(new NoError());
    expect(disconnectionError).toEqual(new NoError());
    expect(retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY, 10));
    expect(retryDisconnect).toBe(
      parseInt(process.env.MONGO_DISCONNECT_RETRY, 10),
    );
    expect(MongoHelper.getRetryConnect()).toBe(
      parseInt(process.env.MONGO_CONNECT_RETRY, 10) - 1,
    );
    expect(MongoHelper.getRetryDisconnect()).toBe(
      parseInt(process.env.MONGO_DISCONNECT_RETRY, 10),
    );
    expect(MongoHelper.getClient()).toHaveProperty('close');
    expect(MongoHelper.getDb()).toEqual({});
  });

  it('Should call client close method in disconnect after connect was called with success', async () => {
    MongoHelper.setRetryConnection(MONGO_ATTEMPTS_TO_RETRY);
    MongoHelper.setRetryDisconnection(MONGO_ATTEMPTS_TO_RETRY);
    const connectionError = await getError(async () =>
      MongoHelper.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME),
    );
    const disconnectionError = await getError(async () =>
      MongoHelper.disconnect(),
    );
    expect(connectionError).toEqual(new NoError());
    expect(disconnectionError).toEqual(new NoError());
    expect(MongoHelper.getClient()).toHaveProperty('close');
    expect(MongoHelper.getClient().close).toHaveBeenCalled();
  });

  it('Should call client close method in disconnect after close retry failed once', async () => {
    MongoDirector.mockImplementation(() => {
      return {
        construct: async _builder => {
          return {
            client: {
              close: jest
                .fn()
                .mockImplementationOnce(() => {
                  throw new Error();
                })
                .mockImplementationOnce(() => {}),
            },
            db: {},
          };
        },
      };
    });
    MongoHelper.setRetryConnection();
    MongoHelper.setRetryDisconnection();
    const retryConnect = MongoHelper.getRetryConnect();
    const retryDisconnect = MongoHelper.getRetryDisconnect();
    const connectionError = await getError(async () =>
      MongoHelper.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME),
    );
    const disconnectionError = await getError(async () =>
      MongoHelper.disconnect(),
    );
    expect(connectionError).toEqual(new NoError());
    expect(disconnectionError).toEqual(new NoError());
    expect(retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY, 10));
    expect(retryDisconnect).toBe(
      parseInt(process.env.MONGO_DISCONNECT_RETRY, 10),
    );
    expect(MongoHelper.getRetryConnect()).toBe(
      parseInt(process.env.MONGO_CONNECT_RETRY, 10),
    );
    expect(MongoHelper.getRetryDisconnect()).toBe(
      parseInt(process.env.MONGO_DISCONNECT_RETRY, 10) - 1,
    );
    expect(MongoHelper.getClient()).toHaveProperty('close');
    expect(MongoHelper.getClient().close).toHaveBeenCalled();
  });

  it('Should throw MongoNotConnectedError if connection retry fails', async () => {
    MongoDirector.mockImplementation(() => {
      return {
        construct: async _builder => {
          throw new Error();
        },
      };
    });
    MongoHelper.setRetryConnection();
    MongoHelper.setRetryDisconnection();
    const retryConnect = MongoHelper.getRetryConnect();
    const retryDisconnect = MongoHelper.getRetryDisconnect();
    const connectionError = await getError(async () =>
      MongoHelper.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME),
    );
    expect(retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY, 10));
    expect(retryDisconnect).toBe(
      parseInt(process.env.MONGO_DISCONNECT_RETRY, 10),
    );
    expect(MongoHelper.getRetryConnect()).toBe(0);
    expect(MongoHelper.getRetryDisconnect()).toBe(
      parseInt(process.env.MONGO_DISCONNECT_RETRY, 10),
    );
    expect(connectionError).toEqual(
      new MongoNotConnectedError('Not possible to connect to MongoDB Driver'),
    );
  });

  it('Should throw MongoServerClosedError if disconnection retry fails', async () => {
    MongoDirector.mockImplementation(() => {
      return {
        construct: async _builder => {
          return {
            client: {
              close: jest.fn().mockImplementation(() => {
                throw new Error();
              }),
            },
            db: {},
          };
        },
      };
    });
    MongoHelper.setRetryConnection();
    MongoHelper.setRetryDisconnection();
    const retryConnect = MongoHelper.getRetryConnect();
    const retryDisconnect = MongoHelper.getRetryDisconnect();
    const connectionError = await getError(async () =>
      MongoHelper.connect(MONGO_FAKE_URI, MONGO_FAKE_DATABASE_NAME),
    );
    const disconnectionError = await getError(async () =>
      MongoHelper.disconnect(),
    );
    expect(connectionError).toEqual(new NoError());
    expect(retryConnect).toBe(parseInt(process.env.MONGO_CONNECT_RETRY, 10));
    expect(retryDisconnect).toBe(
      parseInt(process.env.MONGO_DISCONNECT_RETRY, 10),
    );
    expect(MongoHelper.getRetryConnect()).toBe(
      parseInt(process.env.MONGO_DISCONNECT_RETRY, 10),
    );
    expect(MongoHelper.getRetryDisconnect()).toBe(0);
    expect(disconnectionError).toEqual(
      new MongoServerClosedError('Not possible to close MongoDB Driver'),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
