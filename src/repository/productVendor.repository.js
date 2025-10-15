// services/productVendor.service.js
import * as repo from "../repository/productVendor.repository.js";
import Product from "../models/product.model.js";

export const getAllProductVendors = async () => {
  return await Product.find({ "userType": "User" }) // only User type
    .populate("user", "firstName lastName userType")
    .sort({ createdAt: -1 }) // newest products first
    .lean();
};