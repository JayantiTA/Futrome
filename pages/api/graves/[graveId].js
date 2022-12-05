import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Grave from '../../../models/grave';

import { notFoundError, errorHandler } from '../../../helper/error';

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
  .use(auth())
  .get(async (req, res, next) => {
    await connectToDatabase();
    const grave = await Grave.findById(req.query.graveId);

    if (!grave) {
      return next({
        name: notFoundError,
        message: 'Grave not found',
      });
    }

    return res.json({
      data: grave,
      message: 'Success',
      success: true,
    });
  });

export default handler;
