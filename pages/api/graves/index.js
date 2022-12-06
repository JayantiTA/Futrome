import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Grave from '../../../models/grave';

import { notFoundError, errorHandler } from '../../../helper/error';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '30mb',
    },
  },
};

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
  .get(async (req, res) => {
    await connectToDatabase();
    const { limit, skip } = req.query;
    const totalRecords = await Grave.countDocuments();
    const graves = await Grave.find({}).limit(limit).skip(limit * skip);

    return res.json({
      data: {
        total_records: totalRecords,
        graves,
      },
      message: 'Success',
      success: true,
    });
  })
  .use(auth(''))
  .post(async (req, res) => {
    await connectToDatabase();
    const grave = await Grave.create({
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.json({
      message: 'Grave added successfully',
      data: grave,
      success: true,
    });
  })
  .put(async (req, res, next) => {
    await connectToDatabase();
    const grave = await Grave.findByIdAndUpdate(
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
    );

    if (!grave) {
      return next({
        name: notFoundError,
        message: 'Grave not found',
      });
    }

    return res.json({
      message: 'Grave updated successfully',
      data: grave,
      success: true,
    });
  })
  .delete(async (req, res, next) => {
    await connectToDatabase();
    const grave = await Grave.findByIdAndDelete(req.body._id);

    if (!grave) {
      return next({
        name: notFoundError,
        message: 'Grave not found',
      });
    }

    return res.json({
      message: 'Grave deleted successfully',
      data: grave,
      success: true,
    });
  });

export default handler;
