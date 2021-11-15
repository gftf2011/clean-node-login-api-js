const MongoBuilder = require('./directors/builders/mongo-builder')

const Driver = require('./directors/driver')

module.exports = class MongoHelper {
  async connect (uri, dbName) {
    this.uri = uri
    this.dbName = dbName
    const mongo = new Driver(this.uri, this.dbName)
    const builtMongo = await mongo.construct(new MongoBuilder())
    this.client = builtMongo.client
    this.db = builtMongo.db
  }

  async disconnect () {
    await this.client.close()
  }
}
