// validations/admin.validation.js
import Joi from "joi";

export const getAdminProfileSchema = Joi.object({
  adminId: Joi.string().hex().length(24).required(), // MongoDB ObjectId
});

// Example: If you later add admin update
export const updateAdminSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).optional(),
});

// 👇 New login validation
export const loginAdminSchema = Joi.object({
  identifier: Joi.alternatives().try(
    Joi.string().email(),       // email
    Joi.string().pattern(/^\d{10}$/) // phone (10 digits)
  ).required(),
  password: Joi.string().min(6).required(),
});