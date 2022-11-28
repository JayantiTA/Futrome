import nextConnect from 'next-connect';

import auth from '../../../middleware/auth';
import connectToDatabase from '../../../lib/mongoose';
import Grave from '../../../models/grave';

import { decodeBase64Image, encodeBase64Image } from '../../../helper/image';
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

    let graves = await Grave.find({}).limit(limit).skip(limit * skip);
    graves = graves.map((product) => ({
      ...product._doc,
      images: product.images.map((image) => encodeBase64Image(image)),
    }));

    return res.json({
      data: graves,
      message: 'Success',
      success: true,
    });
  })
  .use(auth('admin'))
  .post(async (req, res) => {
    await connectToDatabase();
    const grave = await Grave.create({
      ...req.body,
      images: req.body.images.map((image) => decodeBase64Image(image)),
      created_at: new Date(),
      updated_at: new Date(),
    });

    return res.json({
      message: 'Grave added successfully',
      data: {
        ...grave._doc,
        images: grave.images.map((image) => encodeBase64Image(image)),
      },
      success: true,
    });
  })
  .put(async (req, res, next) => {
    await connectToDatabase();
    const grave = await Grave.findOneAndUpdate(
      req.body._id,
      {
        ...req.body.data,
        images: req.body.data.images.map((image) => decodeBase64Image(image)),
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
      data: {
        ...grave._doc,
        images: grave.images.map((image) => encodeBase64Image(image)),
      },
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
      data: {
        ...grave._doc,
        images: grave.images.map((image) => encodeBase64Image(image)),
      },
      success: true,
    });
  });

export default handler;
