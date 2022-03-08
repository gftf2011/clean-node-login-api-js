module.exports = class MongoDirector {
  #uri;

  #dbName;

  constructor(uri, dbName) {
    this.#uri = uri;
    this.#dbName = dbName;
  }

  async construct(builder) {
    const result = (await builder.connection(this.#uri))
      .database(this.#dbName)
      .getProduct();
    const { client, db } = result;
    return {
      client,
      db,
    };
  }
};
