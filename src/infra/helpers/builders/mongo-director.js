module.exports = class MongoDirector {
  async construct(builder) {
    await builder.setConnection();
    builder.setDatabase();
    const { client, db } = builder.getProduct();
    return {
      client,
      db,
    };
  }
};
