import { isStrongPassword } from 'validator';

const _ = require('lodash');

export default function validateLoginInput(data) {
  const errors = {};

  // Username checks
  if (_.isEmpty(data.username)) {
    errors.username = 'Username field is required';
  }
  // Password checks
  if (_.isEmpty(data.password)) {
    errors.password = 'Password field is required';
  } else if (!isStrongPassword(data.password, { minSymbols: 0 })) {
    errors.password = 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.';
  }

  return {
    errors,
    isValid: _.isEmpty(errors),
  };
}
