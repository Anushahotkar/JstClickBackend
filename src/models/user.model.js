import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  businessName: { type: String, required: false, default: '' },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  userType: {
    type: String,
    required: true,
    enum: ['User', 'ServiceProvider', 'Admin'],
    default: 'User',
  },
  address: { type: String, required: false },
  profileImage: { type: String },
  refreshToken: { type: String },
  otp: { type: String },
  otpExpiry: { type: Date },
  createdAt: { type: Date, default: Date.now },
  // 🔑 Fields specific to service providers
 
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, userType: this.userType },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1h' }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email, userType: this.userType },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' }
  );
};

export default mongoose.model('User', userSchema);