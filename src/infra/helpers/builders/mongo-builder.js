const { MongoClient } = require('mongodb')

module.exports = class MongoBuilder {
  constructor (uri, dbName) {
    this.uri = uri
    this.dbName = dbName
  }

  async setConnection () {
    this.client = await MongoClient.connect(this.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  setDatabase () {
    this.db = this.client.db(this.dbName)
  }

  getProduct () {
    const result = {
      client: this.client,
      db: this.db
    }
    return result
  }
}
