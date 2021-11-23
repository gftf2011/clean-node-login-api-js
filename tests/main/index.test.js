const app = require('../../src/main/server/app');
const loader = require('../../src/main/loader/load');

jest.mock('../../src/main/server/app');
jest.mock('../../src/main/loader/load', () => jest.fn());
jest.mock('../../src/main/config/routes', () => jest.fn());

describe('Index', () => {
  it('Should call listen method to start server', () => {
    app.mockImplementation(() => ({
      listen: (_port, callback) => {
        if (callback) {
          callback();
        }
      },
    }));
    loader.mockImplementation(() => Promise.resolve());
    const listen = jest.spyOn(app, 'listen');
    // eslint-disable-next-line global-require
    require('../../src/main');
    return loader().then(() => {
      expect(listen).toHaveBeenCalledTimes(1);
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
