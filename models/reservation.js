import mongoose from 'mongoose';

const { Schema } = mongoose;

const reservationSchema = new Schema(
  {
    graves: [{
      id: {
        type: Schema.Types.ObjectId,
        default: new mongoose.Types.ObjectId(),
      },
      location: {
        type: String,
      },
      price: {
        type: Number,
        min: [1, 'Price minimum is 1, got {VALUE}'],
      },
      _id: false,
    }],
    buyer_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Buyer ID is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'paid', 'canceled'],
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
