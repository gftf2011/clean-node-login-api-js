const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')
const contentType = require('../middlewares/content-type')

module.exports = app => {
  app.disable('x-powered-by')
  cors(app)
  jsonParser(app)
  contentType(app)
}
