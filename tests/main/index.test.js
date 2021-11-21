const app = require('../../src/main/server/app');

jest.mock('../../src/main/server/app');

describe('Index', () => {
  it('Should call listen method to start server', () => {
    app.mockImplementation(() => ({
      listen: (_port, callback) => {
        if (callback) {
          callback();
        }
      },
    }));
    const listen = jest.spyOn(app, 'listen');
    // eslint-disable-next-line global-require
    require('../../src/main');
    expect(listen).toHaveBeenCalledTimes(1);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
