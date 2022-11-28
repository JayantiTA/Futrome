import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Reservation from '../../../models/reservation';

import { errorHandler } from '../../../helper/error';

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
  .post(async (req, res) => {
    await connectToDatabase();
    const reservation = await Reservation.create({
      buyer_id: req.user._id,
      status: 'waiting for payment',
      ...req.body,
      reserved_at: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.json({
      message: 'Success',
      data: reservation,
      success: true,
    });
  });

export default handler;
