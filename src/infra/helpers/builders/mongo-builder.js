const { MongoClient } = require('mongodb');

module.exports = class MongoBuilder {
  #product;

  #client;

  constructor() {
    this.#reset();
  }

  #reset() {
    this.#product = {};
  }

  async connection(uri) {
    this.#client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.#product = { ...this.#product, client: this.#client };
    return this;
  }

  database(dbName) {
    const db = this.#client.db(dbName);
    this.#product = { ...this.#product, db };
    return this;
  }

  getProduct() {
    const result = this.#product;
    this.#reset();
    return result;
  }
};
