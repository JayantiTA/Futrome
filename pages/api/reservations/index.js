import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Reservation from '../../../models/reservation';

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

    const filter = {};
    if (req.user.role !== 'admin') {
      filter.buyer.id = req.user._id;
    }

    const totalRecords = await Reservation.countDocuments();
    const reservations = await Reservation.find(filter).limit(limit).skip(limit * skip);

    return res.json({
      data: {
        total_records: totalRecords,
        reservations,
      },
      message: 'Success',
      success: true,
    });
  })
  .use(auth('admin'))
  .post(async (req, res) => {
    await connectToDatabase();
    const reservation = await Reservation.create({
      ...req.body,
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.json({
      message: 'Reservation added successfully',
      data: reservation,
      success: true,
    });
  })
  .put(async (req, res, next) => {
    await connectToDatabase();
    const reservation = await Reservation.findByIdAndUpdate(
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

    if (!reservation) {
      return next({
        name: notFoundError,
        message: 'Reservation not found',
      });
    }

    return res.json({
      message: 'Reservation updated successfully',
      data: reservation,
      success: true,
    });
  })
  .delete(async (req, res, next) => {
    await connectToDatabase();
    const reservation = await Reservation.findByIdAndDelete(req.body._id);

    if (!reservation) {
      return next({
        name: notFoundError,
        message: 'Reservation not found',
      });
    }

    return res.json({
      message: 'Order deleted successfully',
      data: reservation,
      success: true,
    });
  });

export default handler;
