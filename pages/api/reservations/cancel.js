import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Reservation from '../../../models/reservation';
import Grave from '../../../models/grave';

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
  .use(auth())
  .post(async (req, res, next) => {
    await connectToDatabase();
    const reservation = await Reservation.findById(req.body._id);

    if (!reservation || reservation.buyer?.id.toString() !== req.user._id.toString()) {
      return next({
        name: notFoundError,
        message: 'Order not found',
      });
    }

    if (reservation.status !== 'waiting for payment') {
      return next({
        name: localValidationError,
        message: 'Invalid reservation status',
      });
    }

    const grave = await Grave.findByIdAndUpdate(
      req.body.grave?.id,
      {
        status: 'available',
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

    reservation.status = 'cancelled';
    reservation.cancelled_at = new Date();
    reservation.updated_at = new Date();
    await reservation.save();

    return res.json(
      {
        message: 'Reservation cancelled',
        data: reservation,
        success: true,
      },
    );
  });

export default handler;
