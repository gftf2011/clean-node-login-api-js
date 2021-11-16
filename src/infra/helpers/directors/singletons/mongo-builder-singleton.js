const MongoBuilder = require('../builders/mongo-builder')

module.exports = {
  createInstance () {
    this.instance = new MongoBuilder()
    return this.instance
  },

  getInstance () {
    if (!this.instance) {
      this.instance = this.createInstance()
    }
    return this.instance
  }
}
