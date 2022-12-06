import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Reservation from '../../../models/reservation';

import { localValidationError, notFoundError, errorHandler } from '../../../helper/error';

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
  .use(auth('admin'))
  .post(async (req, res, next) => {
    await connectToDatabase();
    const reservation = await Reservation.findById(req.body._id);

    if (!reservation) {
      return next({
        name: notFoundError,
        message: 'Order not found',
      });
    }

    if (reservation.status !== 'paid') {
      return next({
        name: localValidationError,
        message: 'Invalid reservation status',
      });
    }

    reservation.status = 'done';
    reservation.done_at = new Date();
    reservation.updated_at = new Date();
    await reservation.save();

    return res.json({
      message: 'Reservation confirmed',
      data: reservation,
      success: true,
    });
  });

export default handler;
