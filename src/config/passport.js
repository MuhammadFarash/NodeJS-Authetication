import passport from "passport";
import { User } from "../models/user.model.js";
// import localStrategy from './local-strategy';
import localStrategy from 'passport-local';
import bcrypt from 'bcryptjs'
// import { errorMonitor } from "nodemailer/lib/xoauth2/index.js";

// const localStrategy = require('passport-local').Strategy;

passport.use(new localStrategy({ usernameField: 'email' ,passReqToCallback:true}, async (req, email, password, done) => {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, req.flash("error","User not found."));
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return done(null, false, req.flash("error", "Incorrect Password"));
      }
      return done(null, user);
    } catch (error) {
      return done(error);
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

  

  passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        res.locals.user=req.user;
    }
    next();
}

export default passport;