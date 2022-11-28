import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/user';

const createUser = async (req) => {
  await connectToDatabase();
  const user = await User.create({
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  });
  user.password = undefined;

  return user;
};

export default createUser;
