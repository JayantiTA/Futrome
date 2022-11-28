import nextConnect from 'next-connect';

import createUser from './_util';

import { errorHandler } from '../../../helper/error';

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
  .post(async (req, res) => {
    if (req.body.password !== req.body.confirm_password) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: {
          confirm_password: 'Password and confirm password does not match',
        },
        success: false,
      });
    }
    req.body.role = undefined;
    const user = await createUser(req);
    return res.json({
      message: 'Register success',
      data: user,
      success: true,
    });
  });

export default handler;
