import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { User } from '../models/user.model.js';
import dotenv from "dotenv";
import crypto from 'crypto';


dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3300/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user with Google ID exists
          const user = await User.findOne({ googleId: profile.id ,username: profile.displayName,});
      
          if (user) {
            // User exists, log them in
            return done(null, user);
          }
      
          // If user doesn't exist, create a new user
          const newUser = new User({
            username: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            // Other profile information can be stored as needed
            password: crypto.randomBytes(20).toString('hex')
          });
      
          // Save the new user to the database
          await newUser.save();
          return done(null, newUser);
        } catch (error) {
          return done(error, null);
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
    done(error);
  }
});

// export default passport;