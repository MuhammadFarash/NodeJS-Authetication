import express from 'express';
import mongoose from 'mongoose';
import path from "path";
import ejsLayouts from 'express-ejs-layouts';
import session from 'express-session';
import passport from 'passport';
import flash from "connect-flash"
import { connectUsingMongoose } from './src/config/mongoos.js';
import router from './src/routes/routes.js';
import passportlocal from "./src/config/passport.js";
import * as passportGoogle from './src/config/googleAuthentication.js'
import dotenv from "dotenv";


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3300;

app.set('view engine', 'ejs');
app.set('views',path.join(path.resolve(),'src','views'))
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(ejsLayouts)
app.use(session({ secret: process.env.SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
// app.use(passportlocal)
app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

app.use('/',router);
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful Google Sign-In, redirect to a protected route or home
    res.redirect('/');
  }
);






app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectUsingMongoose();
  });