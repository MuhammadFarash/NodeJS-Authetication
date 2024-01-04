import { User } from "../models/user.model.js";
import nodemailer from "nodemailer"
import crypto from 'crypto';
import bcrypt from 'bcrypt';

// import jwt from 'jsonwebtoken';


const transporter = nodemailer.createTransport({
  service:'gmail',
  auth:{
      user:'farashsanu@gmail.com',
      pass:'opic jkqz nujm tnqf'
  }
  });


export default class UserController{

    async getFirstView(req,res){
        res.render('home',{ user: res.locals.user })
    }
    async getSignUp(req,res){
        res.render("register",{ user: res.locals.user })
    }

    async getSignIn(req,res){
        res.render("login",{ user: res.locals.user })
    }

    async postSignUp(req,res){
        const { username,email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            req.flash('error', 'Passwords do not match.');
            return res.redirect('/register')
        }

    try {
        let user = new User({ username, email, password });
        await user.save();
        req.flash('success', 'Account created successfully.');
        res.redirect('/login');
        
    } catch (error) {
        console.log(error)
        req.flash('error', 'Error!');
        res.redirect('/register');
        
    }

    }

    async signOut(req,res){
        req.logout(function(err){
            if(err){
                console.log('error');
                return;
            }
            req.flash('success', 'You have logged out successfully.!!!');
            return res.redirect('/');
        });
        // res.redirect("/")
    }
    async getResetPassword(req, res) {
        res.render('reset-password', { user: res.locals.user,token: req.params.token });
      }
    
    async postResetPassword(req, res) {
        const { email } = req.body;
        console.log(email);

      try {
        const user = await User.findOne({ email });
      if (!user) {
        console.log("The user is: ", user);
        return res.redirect('/reset-password');
      }

      const resetToken = crypto.randomBytes(20).toString('hex');
      // const resetToken = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });
      // const resetToken = bcrypt.hashSync(user.email + user.createdAt, 10);
      user.resetToken = resetToken;
      user.resetTokenExpiration = Date.now() + 360000000;  // 1 hour expiration
      await user.save();

      const resetLink = `http://localhost:3300/reset-password/${resetToken}`;
      const mailOptions = {
        from: 'farashsanu@gmail.com',
        to: email,
        subject: 'Password Reset',
        text: `Click the following link to reset your password: ${resetLink}`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error)
          req.flash('error', 'Error sending reset email.');
          return res.redirect('/reset-password');
        }

        req.flash('success', 'Password reset email sent.');
        res.redirect('/reset-password');
      });
    } catch (error) {
      console.log(error);
      req.flash('error', 'An error occurred.');
      res.redirect('/reset-password');
    }
  }
    
    async getNewPassword(req, res) {
      const { token } = req.params;
      console.log(token);
      try {
        // const decodedToken = jwt.verify(token, 'your-secret-key');
        const user = await User.findOne({
          // _id: decodedToken.userId,
          resetToken: token,
          
          //resetTokenExpiration: { $gt: Date.now() },// Ensure token has not expired
        });
    
        if (!user) {
          req.flash('error', 'Invalid or expired reset token1.');
          return res.redirect('/reset-password');
        }
    
        res.render('new-password', { user });
      } catch (error) {
        console.log(error);
        req.flash('error', 'An error occurred.');
        res.redirect('/reset-password');
      }
      }
    
    async postNewPassword(req, res) {
      const { token } = req.params;
      const { password, confirmPassword } = req.body;
    
      if (password !== confirmPassword) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect(`/reset-password/${token}`);
      }
    
      try {
        // const decodedToken = jwt.verify(token, 'your-secret-key');
        const user = await User.findOne({
          // _id: decodedToken.userId,
          resetToken: token,
          //resetTokenExpiration: { $gt: Date.now() },// Ensure token has not expired
        });
          console.log("user is" ,user)
        if (!user) {
          req.flash('error', 'Invalid or expired reset token2.');
          return res.redirect('/reset-password');
        }
    
        // Update the password and remove the reset token fields
        user.password = password;
        user.resetToken = undefined;
        user.resetTokenExpiration = undefined;
        await user.save();
    
        req.flash('success', 'Password reset successful.');
        res.redirect('/login');
      } catch (error) {
        console.log(error);
        req.flash('error', 'An error occurred.');
        res.redirect(`/reset-password/${token}`);
      }
    }
  
    
    
    
}