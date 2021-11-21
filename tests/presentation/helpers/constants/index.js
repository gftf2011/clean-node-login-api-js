const FAKE_GENERIC_PASSWORD = 'any_password';
const FAKE_GENERIC_EMAIL = 'test@gmail.com';
const FAKE_ACCESS_TOKEN = 'access_token';
const INVALID_FAKE_ACCESS_TOKEN = null;
const INVALID_FAKE_GENERIC_PASSWORD = 'invalid_password';
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com';

const FAKE_HTTP_REQUEST = {
  body: {
    email: FAKE_GENERIC_EMAIL,
    password: FAKE_GENERIC_PASSWORD,
  },
};
const FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD = {
  body: {
    email: INVALID_FAKE_GENERIC_EMAIL,
    password: FAKE_GENERIC_PASSWORD,
  },
};
const FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_INVALID_PASSWORD = {
  body: {
    email: INVALID_FAKE_GENERIC_EMAIL,
    password: INVALID_FAKE_GENERIC_PASSWORD,
  },
};
const INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL = {
  body: {
    password: FAKE_GENERIC_PASSWORD,
  },
};
const INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD = {
  body: {
    email: FAKE_GENERIC_EMAIL,
  },
};
const INVALID_FAKE_EMPTY_HTTP_REQUEST = {};

const AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR_SUT =
  'AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR_SUT';
const AUTH_USE_CASE_WITH_NO_EMAIL_ERROR_SUT =
  'AUTH_USE_CASE_WITH_NO_EMAIL_ERROR_SUT';
const AUTH_USE_CASE_THROWING_SERVER_ERROR_SUT =
  'AUTH_USE_CASE_THROWING_SERVER_ERROR_SUT';
const AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR_SUT =
  'AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR_SUT';
const AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR_SUT =
  'AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR_SUT';
const EMAIL_VALIDATOR_THROWING_ERROR_SUT = 'EMAIL_VALIDATOR_THROWING_ERROR_SUT';

module.exports = {
  FAKE_GENERIC_PASSWORD,
  FAKE_GENERIC_EMAIL,
  FAKE_ACCESS_TOKEN,
  INVALID_FAKE_ACCESS_TOKEN,
  INVALID_FAKE_GENERIC_PASSWORD,
  INVALID_FAKE_GENERIC_EMAIL,
  FAKE_HTTP_REQUEST,
  FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_VALID_PASSWORD,
  FAKE_HTTP_REQUEST_WITH_INVALID_EMAIL_AND_INVALID_PASSWORD,
  INVALID_FAKE_HTTP_REQUEST_WITH_NO_EMAIL,
  INVALID_FAKE_HTTP_REQUEST_WITH_NO_PASSWORD,
  INVALID_FAKE_EMPTY_HTTP_REQUEST,
  AUTH_USE_CASE_WITH_NO_PASSWORD_ERROR_SUT,
  AUTH_USE_CASE_WITH_NO_EMAIL_ERROR_SUT,
  AUTH_USE_CASE_THROWING_SERVER_ERROR_SUT,
  EMAIL_VALIDATOR_THROWING_ERROR_SUT,
  AUTH_USE_CASE_THROWING_MONGO_CONNECTION_ERROR_SUT,
  AUTH_USE_CASE_THROWING_MONGO_CLOSE_ERROR_SUT,
};
