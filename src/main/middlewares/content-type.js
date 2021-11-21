module.exports = app => {
  app.use((_req, res, next) => {
    res.type('json');
    next();
  });
};
