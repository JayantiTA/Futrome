import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Reservation from '../../../models/reservation';
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
  .post(async (req, res, next) => {
    await connectToDatabase();
    const reservation = await Reservation.create({
      status: 'waiting for payment',
      ...req.body,
      reserved_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    const grave = await Grave.findByIdAndUpdate(
      req.body.grave?.id,
      {
        status: 'reserved',
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
      message: 'Success',
      data: reservation,
      success: true,
    });
  });

export default handler;
