import mongoose from 'mongoose';
import validator from 'validator';

const { isEmail, isMobilePhone, isStrongPassword } = validator;
const { Schema } = mongoose;

const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const SALT_WORK_FACTOR = 10;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      unique: true,
      validate: {
        validator: isEmail,
        message: '{VALUE} is not a valid email',
      },
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      validate: {
        validator: (password) => isStrongPassword(password, { minSymbols: 0 }),
        message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number.',
      },
    },
    full_name: {
      type: String,
      required: [true, 'Full Name is required'],
    },
    phone_number: {
      type: String,
      required: [true, 'Phone Number is required'],
      validate: {
        validator: isMobilePhone,
        message: '{VALUE} is not a valid phone number',
      },
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: '{VALUE} is not a valid role',
      },
      default: 'user',
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  },
);

userSchema.pre('save', async function preSave(next) {
  try {
    this.password = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.pre('findOneAndUpdate', async function preFindByIdAndUpdate(next) {
  if (!this._update.password) {
    return next();
  }

  try {
    this._update.password = await bcrypt.hash(this._update.password, SALT_WORK_FACTOR);
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function validatePassword(password) {
  return bcrypt.compare(password, this.password);
};

userSchema.plugin(uniqueValidator, { message: 'This {PATH} is already exists.' });

export default (mongoose.models && mongoose.models.User
  ? mongoose.models.User
  : mongoose.model('User', userSchema));
