const cors = require('../middlewares/cors');
const jsonParser = require('../middlewares/json-parser');
const contentType = require('../middlewares/content-type');
const morgan = require('../middlewares/morgan');
const helmet = require('../middlewares/helmet');
const brute = require('../middlewares/brute');

module.exports = app => {
  app.disable('x-powered-by');
  helmet(app);
  morgan(app);
  cors(app);
  jsonParser(app);
  contentType(app);
  brute(app);
};
