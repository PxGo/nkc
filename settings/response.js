// 响应类型
const ResponseTypes = {
  ERROR_TEMPLATE: 'ERROR_TEMPLATE',
  FORBIDDEN_BECAUSE_LOGGED: 'FORBIDDEN_BECAUSE_LOGGED',
  FORBIDDEN_BECAUSE_UN_LOGGED: 'FORBIDDEN_BECAUSE_UN_LOGGED',
  FORBIDDEN_BECAUSE_BANNED: 'FORBIDDEN_BECAUSE_BANNED',
  FORBIDDEN_BECAUSE_UN_BANNED: 'FORBIDDEN_BECAUSE_UN_BANNED',
  FORBIDDEN_WITH_MESSAGE: 'FORBIDDEN_WITH_MESSAGE',
  FORBIDDEN: 'FORBIDDEN',

  IS_SENSITIVE_CONTENT: 'IS_SENSITIVE_CONTENT',
  USERNAME_LENGTH_ERROR: 'USERNAME_LENGTH_ERROR',
  USERNAME_FORMAT_ERROR: 'USERNAME_FORMAT_ERROR',
  USERNAME_EXISTS_ERROR: 'USERNAME_EXISTS_ERROR',

  USER_DESC_LENGTH_ERROR: 'USER_DESC_LENGTH_ERROR',
  COLUMN_NAME_LENGTH_ERROR: 'COLUMN_NAME_LENGTH_ERROR',
  COLUMN_NAME_FORMAT_ERROR: 'COLUMN_NAME_FORMAT_ERROR',
  COLUMN_DESC_LENGTH_ERROR: 'COLUMN_DESC_LENGTH_ERROR',
  COLUMN_NAME_EXISTS_ERROR: 'COLUMN_NAME_EXISTS_ERROR',
  SENSITIVE_TYPE_ERROR: 'SENSITIVE_TYPE_ERROR',
  USED_QUESTION_TAG_NAME: 'USED_QUESTION_TAG_NAME',
  INVALID_QUESTION_TAG_ID: 'INVALID_QUESTION_TAG_ID',
  TAG_HAS_QUESTIONS_ERROR: 'TAG_HAS_QUESTIONS_ERROR',
  TAG_HAS_CATEGORY_ERROR: 'TAG_HAS_CATEGORY_ERROR',
};

module.exports = {
  ResponseTypes,
};
