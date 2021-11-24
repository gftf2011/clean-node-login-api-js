module.exports = {
  MONGO_URL: process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/',
  MONGO_DATABASE: process.env.MONGO_DATABASE || 'clean_node_login_api',
  MONGO_RETRY: process.env.MONGO_CONNECT_RETRY
    ? parseInt(process.env.MONGO_CONNECT_RETRY, 10)
    : 2,
  TOKEN_SECRET: process.env.TOKEN_SECRET || 'secret',
};