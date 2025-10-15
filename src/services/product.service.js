import { ApiError } from "../utils/ApiError.js";
import * as repo from "../repository/product.repository.js";
import ProductCategory from "../models/productCategory.model.js";

import mongoose from "mongoose";

// Map unit to dynamic field
const unitFieldMap = {
  quantity: "quantity",
  kg: "weight",
  liters: "volume",
};

// Fetch all products
export const fetchAllProductsService = async () => {
  return await repo.getAllProducts();
};

// Fetch product by ID
export const fetchProductByIdService = async (id) => {
  const product = await repo.getProductById(id);
  if (!product) throw new ApiError(404, "Product not found");
  return product;
};

// Add product (handle single or multiple images)
// Add product (handle single or multiple images, category name or ID)
// Add Product
// Add Product
export const addProductService = async (data, user) => {
  const { name, category, cost, description, image, unit } = data;

  if (!name || !category || !cost || !image|| !unit) {
    throw new ApiError(400, "Name, category, cost, unit and image are required");
  }
  const dynamicField = unitFieldMap[unit];
  if (!dynamicField || data[dynamicField] === undefined || data[dynamicField] <= 0) {
    throw new ApiError(400, `${dynamicField} is required and must be positive when unit is '${unit}'`);
  }

  // Handle category: existing ObjectId or new category name
  let categoryId;
  if (mongoose.Types.ObjectId.isValid(category)) {
    const cat = await ProductCategory.findById(category);
    if (!cat) throw new ApiError(404, "Category not found");
    categoryId = cat._id;
  } else {
    let cat = await ProductCategory.findOne({ name: category });
    if (!cat) cat = await ProductCategory.create({ name: category ,
      creatorModel: user.userType, // 'Admin' or 'User'
    createdBy: user._id
    });
    categoryId = cat._id;
  }

  const productData = {
    name,
    category: categoryId,
    cost,
    description: description || "",
    image, // single image
    unit,
    user: user._id,
    userType: user.userType,
    [dynamicField]: data[dynamicField],
  };

  return await repo.createProduct(productData);
};




// Update product (handle images)
// Update product
export const updateProductService = async (id, data) => {
  const updatedData = { ...data };
  if (data.image) updatedData
  .image = data.image; // single image


  if (updatedData.unit) {
    const dynamicField = unitFieldMap[updatedData.unit];
    if (!dynamicField || updatedData[dynamicField] === undefined || updatedData[dynamicField] <= 0) {
      throw new ApiError(400,
         `${dynamicField} is required and must be positive when unit is '${updatedData.unit}'`);
    }
  }

  const updated = await repo
  .updateProduct(id, updatedData);
  if (!updated) throw new ApiError(404, "Product not found");
  return updated;
};

// Delete product
export const deleteProductService = async (id) => {
  const deleted = await repo.deleteProduct(id);
  if (!deleted) throw new ApiError(404, "Product not found");
  return deleted;
};

// Fetch products by category
export const fetchProductsByCategoryService = async (categoryId) => {
  const products = await repo.getProductsByCategory(categoryId);
  return products;
};



// ✅ Delete all products when a category is deleted
export const deleteProductsOfCategoryService = async (categoryId) => {
  if (!categoryId) throw new ApiError(400, "Category ID is required");

  // Fetch products in this category (so we can clean up images in Cloudinary)
  const products = await repo.getProductsByCategory(categoryId);

  for (const product of products) {
    if (product.images && Array.isArray(product.images)) {
      for (const img of product.images) {
        try {
          const publicId = img.publicId || img.split("/").pop().split(".")[0]; 
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error(`❌ Failed to delete Cloudinary image for product ${product._id}:`, err.message);
        }
      }
    }
  }

  // Bulk delete from DB
  const result = await repo.deleteProductsByCategory(categoryId);
  return result;
};


export const fetchCategoryNameByProductService = async (productId) => {
  if (!productId) throw new ApiError(400, "Product ID is required");

  const categoryName = await repo.getCategoryNameByProductId(productId);
  if (!categoryName) throw new ApiError(404, "Category not found for this product");

  return { categoryName };
};