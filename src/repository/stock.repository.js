// repository/stock.repository.js
import Product from "../models/product.model.js";
import Service from "../models/service.model.js";
import ProductCategory from "../models/productCategory.model.js";
import Category from "../models/category.model.js";

export const getProductsByCategoryId = async (categoryId) => {
  return await Product.find({ category: categoryId })
    .populate({ path: "user", select: "firstName lastName" })
    .populate({ path: "category", select: "name" })
    .lean();
};

export const getServicesByCategoryId = async (categoryId) => {
  return await Service.find({ category: categoryId })
    .populate({ path: "user", select: "firstName lastName" })
    .populate({ path: "category", select: "name" })
    .lean();
};

export const findCategoryById = async (categoryId, type = "product") => {
  if (type === "product") {
    return await ProductCategory.findById(categoryId);
  } else {
    return await Category.findById(categoryId);
  }
};
