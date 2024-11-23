import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/user.model.js';

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${process.env.API_URL}/auth/facebook/callback`,
  profileFields: ['id', 'emails', 'name']
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ facebookId: profile.id });
    if (existingUser) {
      return done(null, existingUser);
    }

    const newUser = new User({
      facebookId: profile.id,
      email: profile.emails[0].value,
      name: `${profile.name.givenName} ${profile.name.familyName}`,
    });

    await newUser.save();
    done(null, newUser);
  } catch (error) {
    done(error, false);
  }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  });
  
  export default passport;