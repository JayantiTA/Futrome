import mongoose from 'mongoose';

const { Schema } = mongoose;

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
    },
    size: {
      type: Number,
      min: [1, 'Size is 1m2, got {VALUE}m2'],
      required: [true, 'Size is required'],
    },
    capacity: {
      type: Number,
      min: [1, 'Capacity minimum is 1, got {VALUE}'],
      required: [true, 'Capacity is required'],
    },
    images: [{
      content: String,
      imageFormat: String,
    }],
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

export default (mongoose.models && mongoose.models.Grave
  ? mongoose.models.Grave
  : mongoose.model('Grave', graveSchema));
