import { asyncHandler } from '../utils/asyncHandler.js'; 
import { ApiResponse } from '../utils/ApiResponse.js';
import { registerUser, requestOtpService, loginWithOtpService } from '../services/user.service.js';
import { getUserProfileService, updateUserProfileService } from "../services/user.service.js";
import {
  requestOtpSchema,
  loginWithOtpSchema,
  registerUserSchema,
  updateUserProfileSchema,
} from "../validations/user.validation.js";
import { validate } from "../middlewares/validate.js";

// Get Profile (from JWT, no body validation needed)
export const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id; 
  const user = await getUserProfileService(userId);

  return res.json(new ApiResponse(200, user, "User profile fetched successfully"));
});

// Update Profile
export const updateProfile = [
  validate(updateUserProfileSchema, "body"),
  asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const updatedUser = await updateUserProfileService(userId, req.body, req.file);

    return res.json(new ApiResponse(200, updatedUser, "User profile updated successfully"));
  })
];

// Step 1: Request OTP
export const requestOtp = [
  validate(requestOtpSchema, "body"),
  asyncHandler(async (req, res) => {
    const { phone } = req.body;
    const { otp } = await requestOtpService(phone);

    return res.json(new ApiResponse(200, { phone, otp }, 'OTP generated successfully'));
  })
];

// Step 2: Login with OTP
export const login = [
  validate(loginWithOtpSchema, "body"),
  asyncHandler(async (req, res) => {
    const { phone, otp } = req.body;

    const { user, accessToken, refreshToken } = await loginWithOtpService(phone, otp);

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None',
      maxAge: 60 * 60 * 1000, // 1 hour
    });

    const safeUser = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      userType: user.userType,
    };

    return res.json(new ApiResponse(200, { user: safeUser, accessToken, refreshToken }, 'Login successful'));
  })
];

// Register
export const register = [
  validate(registerUserSchema, "body"),
  asyncHandler(async (req, res) => {
    const userData = req.body;

    const { newUser, accessToken, refreshToken } = await registerUser(userData);

    const safeUser = {
      _id: newUser._id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      phone: newUser.phone,
      userType: newUser.userType,
    };

    return res.status(201).json(new ApiResponse(201, { user: safeUser, accessToken, refreshToken }, 'User registered successfully'));
  })
];
