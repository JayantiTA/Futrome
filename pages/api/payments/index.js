import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Reservation from '../../../models/reservation';
import Payment from '../../../models/payment';

import { localValidationError, notFoundError, errorHandler } from '../../../helper/error';
import { decodeBase64Image, encodeBase64Image } from '../../../helper/image';

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
    const filter = { _id: req.body.reservation_id, buyer: {} };
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

    if (reservation.status !== 'waiting for payment') {
      return next({
        name: localValidationError,
        message: 'Invalid reservation status',
      });
    }

    const payment = await Payment.create({
      ...req.body,
      attachment: decodeBase64Image(req.body.attachment),
      created_at: new Date(),
      updated_at: new Date(),
    });

    reservation.status = 'paid';
    reservation.paid_at = new Date();
    await reservation.save();

    return res.json({
      message: 'Payment added successfully',
      data: {
        ...payment._doc,
        attachment: encodeBase64Image(payment.attachment),
      },
      success: true,
    });
  });

export default handler;
