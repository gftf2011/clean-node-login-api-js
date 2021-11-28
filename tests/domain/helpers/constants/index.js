const FAKE_GENERIC_NAME = 'any_name';
const FAKE_GENERIC_CPF = 'valid_cpf';
const FAKE_GENERIC_ACCESS_TOKEN = 'any_token';
const FAKE_GENERIC_USER_ID = 'any_user_id';
const FAKE_GENERIC_EMAIL = 'test@gmail.com';
const FAKE_GENERIC_PASSWORD = 'any_password';
const FAKE_HASHED_PASSWORD = 'hashed_password';
const INVALID_FAKE_GENERIC_EMAIL = 'invalid_test@gmail.com';
const INVALID_FAKE_GENERIC_PASSWORD = 'invalid_password';

const FAKE_GENERIC_USER = {
  email: FAKE_GENERIC_EMAIL,
  password: FAKE_GENERIC_PASSWORD,
  cpf: FAKE_GENERIC_CPF,
  name: FAKE_GENERIC_NAME,
};

const LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT =
  'LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT';
const ENCRYPTER_WITH_ERROR_SUT = 'ENCRYPTER_WITH_ERROR_SUT';
const TOKEN_GENERATOR_WITH_ERROR_SUT = 'TOKEN_GENERATOR_WITH_ERROR_SUT';
const UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT =
  'UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT';

module.exports = {
  FAKE_GENERIC_USER,
  FAKE_GENERIC_NAME,
  FAKE_GENERIC_CPF,
  FAKE_GENERIC_ACCESS_TOKEN,
  FAKE_GENERIC_USER_ID,
  FAKE_GENERIC_EMAIL,
  FAKE_GENERIC_PASSWORD,
  FAKE_HASHED_PASSWORD,
  INVALID_FAKE_GENERIC_EMAIL,
  INVALID_FAKE_GENERIC_PASSWORD,
  LOAD_USER_BY_EMAIL_REPOSITORY_WITH_ERROR_SUT,
  ENCRYPTER_WITH_ERROR_SUT,
  TOKEN_GENERATOR_WITH_ERROR_SUT,
  UPDATE_ACCESS_TOKEN_REPOSITORY_WITH_ERROR_SUT,
};
