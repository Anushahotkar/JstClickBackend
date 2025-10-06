import Joi from "joi";
import mongoose from "mongoose";


// Mongo ObjectId validation
const objectId = Joi.string().hex().length(24);

// Single image, category can be existing ObjectId or new category name
export const addProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  category: Joi.string().required(), // ObjectId or new category name
  cost: Joi.number().positive().required(),
  description: Joi.string().max(1000).allow("").optional(),
  image: Joi.string().uri().required(), // single image URL from Cloudinary
});

// Update Product
export const updateProductSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  category: Joi.string().optional(),
  cost: Joi.number().positive().optional(),
  description: Joi.string().max(1000).allow("").optional(),
  image: Joi.string().uri().optional(),
});

// Get Product by ID
export const getProductSchema = Joi.object({
  productId: Joi.string()
    .custom((value, helpers) => {
      if (!mongoose.Types.ObjectId.isValid(value))
        return helpers.error("any.invalid");
      return value;
    })
    .required(),
});


// Get Products by Category
export const getProductsByCategorySchema = Joi.object({
  categoryId: objectId.required(),
});