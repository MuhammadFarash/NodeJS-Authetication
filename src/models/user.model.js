import mongoose from "mongoose";
import bcrypt from 'bcryptjs'
import passportLocalMongoose from "passport-local-mongoose"


const userSchema = new mongoose.Schema({
    username: { type: String, unique:false},
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    resetToken: String,  // Add a field to store the reset token
    resetTokenExpiration: Date,  // Add a field to store the token expiration time
    googleId: String,
    
  });
  
  userSchema.pre('save', async function (next) {
    try {
      if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      next();
    } catch (error) {
      next(error);
    }
  });

  // userSchema.plugin(passportLocalMongoose);
  
  export const User = mongoose.model('User', userSchema);
  