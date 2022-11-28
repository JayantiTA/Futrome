import nextConnect from 'next-connect';

import passport from '../lib/passport';

import { unauthorizedError, forbiddenError } from '../helper/error';

const jwt = require('jsonwebtoken');

const auth = (role = 'user') => nextConnect()
  .use((req, res, next) => {
    req.session = {};

    let authHeader = req.headers.authorization;
    if (!authHeader) {
      return next({
        name: unauthorizedError,
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      authHeader = `Bearer ${authHeader}`;
    }

    const token = authHeader.split('Bearer ')[1].trim();
    try {
      req.session = jwt.verify(token, process.env.SECRET_OR_KEY).session;
    } catch (err) {
      return next({
        name: unauthorizedError,
        message: 'Invalid access token',
      });
    }

    next();
  })
  .use(passport.initialize())
  .use(passport.session())
  .use((req, res, next) => {
    if (req.user && (req.user.role === role || req.user.role === 'admin')) {
      return next();
    }

    next({
      name: forbiddenError,
      message: 'Insufficient permissions',
    });
  });

export default auth;
