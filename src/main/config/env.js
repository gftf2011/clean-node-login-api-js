module.exports = {
  MONGO_URL: process.env.MONGO_URL || '',
  MONGO_INITDB_DATABASE:
    process.env.MONGO_INITDB_DATABASE || 'clean_node_login_api',
  MONGO_RETRY: process.env.MONGO_CONNECT_RETRY
    ? parseInt(process.env.MONGO_CONNECT_RETRY, 10)
    : 2,
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',
  APPLICATION_PORT: process.env.APPLICATION_PORT
    ? parseInt(process.env.APPLICATION_PORT, 10)
    : 3333,
};
