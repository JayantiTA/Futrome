import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Reservation from '../../../models/reservation';
import Payment from '../../../models/payment';

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
    const filter = { _id: req.query.reservationId };
    if (req.user.role !== 'admin') {
      filter.buyer.id = req.user._id;
    }
    const reservation = await Reservation.findOne(filter);

    if (!reservation) {
      return next({
        name: notFoundError,
        message: 'Reservation not found',
      });
    }

    let payment;
    if (reservation.status === 'paid') {
      payment = await Payment.findOne({ reservation_id: reservation._id });
      payment.attachment = encodeBase64Image(payment.attachment);
    }

    return res.json({
      data: {
        reservation,
        payment,
      },
      message: 'Success',
      success: true,
    });
  });

export default handler;
