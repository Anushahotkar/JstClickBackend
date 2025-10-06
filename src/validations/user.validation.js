// validations/user.validation.js
import Joi from "joi";

// Phone number must be exactly 10 digits
const phoneSchema = Joi.string().pattern(/^\d{10}$/).required();

export const requestOtpSchema = Joi.object({
  phone: phoneSchema,
});

export const loginWithOtpSchema = Joi.object({
  phone: phoneSchema,
  otp: Joi.string().length(6).required(), // Assuming 6-digit OTP
});

export const registerUserSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().optional(),
  phone: phoneSchema,
  userType: Joi.string().valid("user", "admin").default("user"),
});

export const updateUserProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  email: Joi.string().email().optional(),
  phone: phoneSchema.optional(),
});
