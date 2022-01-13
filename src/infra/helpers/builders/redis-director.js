module.exports = class RedisDirector {
  construct(builder) {
    builder.setClient();
    const { client } = builder.getProduct();
    return { client };
  }
};
