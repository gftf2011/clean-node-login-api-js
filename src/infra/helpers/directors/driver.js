module.exports = class Driver {
  constructor (uri, dbName) {
    this.uri = uri
    this.dbName = dbName
  }

  async construct (builder) {
    await builder.setClient(this.uri)
    builder.setDatabase(this.dbName)
    const client = builder.getClient()
    const db = builder.getDatabase()
    return {
      client,
      db
    }
  }
}
