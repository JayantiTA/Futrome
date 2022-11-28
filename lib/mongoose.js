import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = { conn: null, promise: null };
  global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
    };

    const { MONGODB_URI } = process.env;
    if (!MONGODB_URI) {
      throw new Error('Define the MONGODB_URI environmental variable');
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mgs) => mgs);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
