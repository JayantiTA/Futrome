/* eslint-disable no-console */
const mongoValidationError = 'ValidationError';
const localValidationError = 'LocalValidationError';
const notFoundError = 'NotFoundError';
const unauthorizedError = 'UnauthorizedError';
const forbiddenError = 'ForbiddenError';

const errorHandler = (error, req, res) => {
  console.log(error);
  switch (error.name) {
    case localValidationError:
    case mongoValidationError: {
      let errors = {};
      if (error.name === localValidationError) {
        errors = error.errors;
      } else {
        Object.values(error.errors).forEach((err) => {
          errors[err.path] = err.message;
        });
      }

      return res.status(400).json({
        message: 'Validation failed',
        errors,
        success: false,
      });
    }
    case unauthorizedError:
      return res.status(401).json({
        message: error.message || 'Unauthorized',
        success: false,
      });
    case forbiddenError:
      return res.status(403).json({
        message: error.message || 'Forbidden',
        success: false,
      });
    case notFoundError:
      return res.status(404).json({
        message: error.message || 'Not found',
        success: false,
      });
    default:
      return res.status(500).json({
        message: 'Internal server error',
        success: false,
      });
  }
};

export {
  localValidationError,
  mongoValidationError,
  notFoundError,
  unauthorizedError,
  forbiddenError,
  errorHandler,
};
