module.exports = class RedisDirector {
  #host;

  #port;

  constructor(host, port) {
    this.#host = host;
    this.#port = port;
  }

  construct(builder) {
    const result = builder.client(this.#host, this.#port).getProduct();
    const { client } = result;
    return { client };
  }
};
