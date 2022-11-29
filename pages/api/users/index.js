import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/user';
import createUser from './_util';

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
  .get(async (req, res) => {
    await connectToDatabase();
    const { limit, skip } = req.query;
    const totalRecords = await User.countDocuments();
    const users = await User.find({}).select('-password').limit(limit).skip(limit * skip);

    return res.json({
      data: {
        total_records: totalRecords,
        users,
      },
      message: 'Success',
      success: true,
    });
  })
  .use(auth('admin'))
  .post(async (req, res) => {
    const user = await createUser(req);
    return res.json({
      message: 'User added successfully',
      data: user,
      success: true,
    });
  })
  .put(async (req, res, next) => {
    await connectToDatabase();
    const user = await User.findByIdAndUpdate(
      req.body._id,
      {
        ...req.body.data,
        updated_at: new Date(),
      },
      {
        runValidators: true,
        context: 'query',
        new: true,
      },
    ).select('-password');

    if (!user) {
      return next({
        name: notFoundError,
        message: 'User not found',
      });
    }

    return res.json({
      message: 'User updated successfully',
      data: user,
      success: true,
    });
  })
  .delete(async (req, res, next) => {
    await connectToDatabase();
    const user = await User.findByIdAndDelete(req.body._id).select('-password');
    if (!user) {
      return next({
        name: notFoundError,
        message: 'User not found',
      });
    }

    return res.json({
      message: 'User deleted successfully',
      data: user,
      success: true,
    });
  });

export default handler;
