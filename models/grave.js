import mongoose from 'mongoose';

const { Schema } = mongoose;
const uniqueValidator = require('mongoose-unique-validator');

const graveSchema = new Schema(
  {
    type: {
      type: String,
      enum: {
        values: ['single', 'semi private', 'private'],
        message: '{VALUE} is not a valid status',
      },
      required: [true, 'Size is required'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      unique: true,
    },
    size: {
      type: Number,
      min: [1, 'Size is 1m2, got {VALUE}m2'],
      required: [true, 'Size is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity minimum is 1, got {VALUE}'],
      required: [true, 'Capacity is required'],
    },
    price: {
      type: Number,
      min: [1, 'Price minimum is 1, got {VALUE}'],
      required: [true, 'Price is required'],
    },
    status: {
      type: String,
      enum: {
        values: ['available', 'reserved'],
        message: '{VALUE} is not a valid status',
      },
      required: [true, 'Status is required'],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

graveSchema.plugin(uniqueValidator, { message: 'This {PATH} is already exists.' });

export default (mongoose.models && mongoose.models.Grave
  ? mongoose.models.Grave
  : mongoose.model('Grave', graveSchema));
