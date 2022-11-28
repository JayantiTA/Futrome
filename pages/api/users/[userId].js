import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/user';

import { encodeBase64Image } from '../../../helper/image';
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
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return next({
        name: notFoundError,
        message: 'User not found',
      });
    }

    return res.json({
      data: {
        ...user._doc,
        images: user.images.map((image) => encodeBase64Image(image)),
      },
      message: 'Success',
      success: true,
    });
  });

export default handler;
