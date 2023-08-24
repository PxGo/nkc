// 响应类型
const ResponseTypes = {
  ERROR_TEMPLATE: 'ERROR_TEMPLATE',
  FORBIDDEN_BECAUSE_LOGGED: 'FORBIDDEN_BECAUSE_LOGGED',
  FORBIDDEN_BECAUSE_UN_LOGGED: 'FORBIDDEN_BECAUSE_UN_LOGGED',
  FORBIDDEN_BECAUSE_BANNED: 'FORBIDDEN_BECAUSE_BANNED',
  FORBIDDEN_BECAUSE_UN_BANNED: 'FORBIDDEN_BECAUSE_UN_BANNED',
  FORBIDDEN_WITH_MESSAGE: 'FORBIDDEN_WITH_MESSAGE',
  FORBIDDEN_BECAUSE_NO_CERT: 'FORBIDDEN_BECAUSE_NO_CERT',
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
  INVALID_QUESTION_TYPE: 'INVALID_QUESTION_TYPE',
  INVALID_QUESTION_VOLUME: 'INVALID_QUESTION_VOLUME',
  INVALID_CH4_QUESTION_ANSWER_COUNT: 'INVALID_CH4_QUESTION_ANSWER_COUNT',
  INVALID_CH4_QUESTION_CORRECT_ANSWER_COUNT:
    'INVALID_CH4_QUESTION_CORRECT_ANSWER_COUNT',
  INVALID_ANS_QUESTION_ANSWER_COUNT: 'INVALID_ANS_QUESTION_ANSWER_COUNT',
  INVALID_QUESTION_TAG_COUNT: 'INVALID_QUESTION_TAG_COUNT',
  INVALID_QUESTION_ID: 'INVALID_QUESTION_ID',
  FORBIDDEN_BECAUSE_QUESTION_DISABLED: 'FORBIDDEN_BECAUSE_QUESTION_DISABLED',
  FORBIDDEN_TO_CREATE_QUESTION: 'FORBIDDEN_TO_CREATE_QUESTION',
  INSUFFICIENT_QUESTION_COUNT: 'INSUFFICIENT_QUESTION_COUNT',
  DUPLICATE_QUESTIONS_IN_SELECTED_BANKS:
    'DUPLICATE_QUESTIONS_IN_SELECTED_BANKS',
  INVALID_EXAM_PAPER_ID: 'INVALID_EXAM_PAPER_ID',
  INVALID_ACTIVATION_CODE_ID: 'INVALID_ACTIVATION_CODE_ID',
  QUESTION_DOES_NOT_EXIST: 'QUESTION_DOES_NOT_EXIST',
  EXAM_HAS_ENDED: 'EXAM_HAS_ENDED',
  FORBIDDEN_REGISTER_EXAM_CHECK_RATE_LIMIT:
    'FORBIDDEN_REGISTER_EXAM_CHECK_RATE_LIMIT',
  EXAM_CONCLUDED_REGISTER_NOW: 'EXAM_CONCLUDED_REGISTER_NOW',
};

module.exports = {
  ResponseTypes,
};
