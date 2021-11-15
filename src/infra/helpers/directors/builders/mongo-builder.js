const { MongoClient } = require('mongodb')

module.exports = class MongoBuilder {
  async setClient (uri) {
    this.client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  }

  setDatabase (dbName) {
    this.db = this.client.db(dbName)
  }

  getClient () {
    return this.client
  }

  getDatabase () {
    return this.db
  }
}
