const cors = require('cors')

module.exports = app => {
  app.disable('x-powered-by')

  app.use(cors())
  app.use((_req, res, next) => {
    res.set('access-control-allow-methods', '*')
    res.set('access-control-allow-headers', '*')
    next()
  })
}
