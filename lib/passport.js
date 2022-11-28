import LocalStrategy from 'passport-local';
import passport from 'passport';

import connectToDatabase from './mongoose';
import User from '../models/user';

passport.serializeUser((user, done) => {
  // serialize the username into session
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // deserialize the username back into user object
  await connectToDatabase();
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    await connectToDatabase();
    const user = await User.findOne({ username });
    if (!user || !await user.comparePassword(password)) {
      done(null, null);
    } else {
      done(null, user);
    }
  }),
);

export default passport;
