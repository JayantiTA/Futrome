import mongoose from 'mongoose';

const { Schema } = mongoose;

const paymentSchema = new Schema(
  {
    reservation_id: {
      type: Schema.Types.ObjectId,
      required: [true, 'Reservation ID is required'],
    },
    bank: {
      type: String,
      enum: {
        values: ['BRI', 'BNI', 'Mandiri', 'BSI', 'BCA'],
        message: '{VALUE} is not a valid bank option',
      },
      required: [true, 'Bank is required'],
    },
    bank_account: {
      name: {
        type: String,
        required: [true, 'Account Name is required'],
      },
      number: {
        type: String,
        required: [true, 'Account Number is required'],
      },
    },
    attachment: {
      content: String,
      imageFormat: String,
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export default (mongoose.models && mongoose.models.Payment
  ? mongoose.models.Payment
  : mongoose.model('Payment', paymentSchema));
