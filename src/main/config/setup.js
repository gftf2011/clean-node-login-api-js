const cors = require('../middlewares/cors');
const jsonParser = require('../middlewares/json-parser');
const contentType = require('../middlewares/content-type');
const morgan = require('../middlewares/morgan');

module.exports = app => {
  app.disable('x-powered-by');
  morgan(app);
  cors(app);
  jsonParser(app);
  contentType(app);
};
