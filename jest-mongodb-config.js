module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: '4.0.3',
      skipMD5: true
    },
    instance: {
      dbName: 'clean_node_login_api'
    },
    autoStart: false
  }
}
