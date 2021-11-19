const cors = require('../middlewares/cors')
const jsonParser = require('../middlewares/json-parser')

module.exports = app => {
  app.disable('x-powered-by')
  cors(app)
  jsonParser(app)
}
