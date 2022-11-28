import nextConnect from 'next-connect';

import validateLoginInput from '../../../validation/login';
import passport from '../../../lib/passport';

import { unauthorizedError, localValidationError, errorHandler } from '../../../helper/error';

const jwt = require('jsonwebtoken');

const handler = nextConnect({
  onError: errorHandler,
  onNoMatch: (req, res) => {
    res.status(405).json({
      message: 'Method not allowed',
      success: false,
    });
  },
});

handler
  .post((req, res, next) => {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return next({
        name: localValidationError,
        errors,
      });
    }

    passport.authenticate('local', (error, user) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return next({
          name: unauthorizedError,
          message: 'Username or password is incorrect',
        });
      }

      req.logIn(user, (loginError) => {
        if (loginError) {
          return next(loginError);
        }
      });
      next();
    })(req, res);
  })
  .post((req, res, next) => {
    const { user } = req;
    const payload = {
      session: req.session,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    };
    jwt.sign(
      payload,
      process.env.SECRET_OR_KEY,
      {
        expiresIn: '3h',
      },
      (err, token) => {
        if (err) {
          return next(err);
        }

        res.json({
          message: 'Login successful',
          data: {
            accessToken: token,
            user: payload.user,
          },
          success: true,
        });
      },
    );
  });

export default handler;
