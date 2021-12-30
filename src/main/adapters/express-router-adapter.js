module.exports = class ExpressRouterAdapter {
  static adapter(router) {
    return async (req, res) => {
      const httpRequest = {
        headers: req.headers,
        body: req.body,
      };
      const httpResponse = await router.route(httpRequest);
      res.status(httpResponse.statusCode).json(httpResponse.body);
    };
  }
};
