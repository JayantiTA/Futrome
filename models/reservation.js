import mongoose from 'mongoose';
import validator from 'validator';

const { isNumeric, isMobilePhone } = validator;
const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    grave: {
      id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
      location: {
        type: String,
        required: [true, 'Location is required'],
      },
      price: {
        type: Number,
        required: [true, 'Price is required'],
      },
      _id: false,
    },
    buyer_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Buyer ID is required'],
    },
    buyer_data: {
      name: {
        type: String,
        required: [true, 'Buyer name is required'],
      },
      ktp: {
        type: String,
        required: [true, 'Buyer KTP is required'],
        validate: {
          validator: isNumeric,
          message: '{VALUE} is not a valid ktp number',
        },
      },
      phone_number: {
        type: String,
        validate: {
          validator: isMobilePhone,
          message: '{VALUE} is not a valid phone number',
        },
        required: [true, 'Buyer phone number is required'],
      },
      _id: false,
    },
    status: {
      type: String,
      enum: {
        values: ['waiting for payment', 'waiting for confirmation', 'paid', 'cancelled', 'done', 'rejected'],
        message: '{VALUE} is not a valid status',
      },
      default: 'pending',
    },
    reserved_at: {
      type: Date,
    },
    paid_at: {
      type: Date,
    },
    rejected_at: {
      type: Date,
    },
    confirmed_at: {
      type: Date,
    },
    cancelled_at: {
      type: Date,
    },
    done_at: {
      type: Date,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export default (mongoose.models && mongoose.models.Reservation
  ? mongoose.models.Reservation
  : mongoose.model('Reservation', reservationSchema));
