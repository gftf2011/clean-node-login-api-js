const MONGO_ATTEMPTS_TO_RETRY = 3;
const MONGO_FAKE_URI = 'any_uri';
const MONGO_FAKE_DATABASE_NAME = 'any_database';

/**
 * Load User By Email Repository
 */
const LOAD_USER_BY_EMAIL_REPOSITORY_SUT_EMPTY = Symbol(
  'LOAD_USER_BY_EMAIL_REPOSITORY_SUT_EMPTY',
);
const LOAD_USER_BY_EMAIL_REPOSITORY_SUT_EMPTY_OBJECT = Symbol(
  'LOAD_USER_BY_EMAIL_REPOSITORY_SUT_EMPTY_OBJECT',
);
const LOAD_USER_BY_EMAIL_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT = Symbol(
  'LOAD_USER_BY_EMAIL_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT',
);

/**
 * Update Access Token Repository
 */
const UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY = Symbol(
  'UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY',
);
const UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY_OBJECT = Symbol(
  'UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY_OBJECT',
);
const UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT = Symbol(
  'UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT',
);

module.exports = {
  MONGO_ATTEMPTS_TO_RETRY,
  MONGO_FAKE_URI,
  MONGO_FAKE_DATABASE_NAME,
  LOAD_USER_BY_EMAIL_REPOSITORY_SUT_EMPTY,
  LOAD_USER_BY_EMAIL_REPOSITORY_SUT_EMPTY_OBJECT,
  LOAD_USER_BY_EMAIL_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY,
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_EMPTY_OBJECT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_SUT_WITH_EMPTY_USER_MODEL_OBJECT,
};
