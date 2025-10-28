// services/stock.service.js
import * as categoryRepo from "../repository/category.repository.js";
import * as stockRepo from "../repository/stock.repository.js";
import { ApiError } from "../utils/ApiError.js";


export const getAllCategoriesForStock = async () => {
  const serviceCategories = await categoryRepo.getAllCategories();
  const productCategories = await categoryRepo.getAllProductCategories();

  return {
    serviceCategories,
    productCategories,
  };
};

export const getItemsByCategory = async (categoryId, type = "product") => {
  // Validate category exists
  const category = await stockRepo.findCategoryById(categoryId, type);
  if (!category) throw new ApiError(404, "Category not found");

  if (type === "product") {
    const products = await stockRepo.getProductsByCategoryId(categoryId);
    return products.map(p => ({
      id: p._id,
      name: p.name,
      category: p.category.name,
      status: p.quantity > 0 ? "Available" : "Out of stock",
      quantity: p.quantity,
      vendorName: p.user ? `${p.user.firstName} ${p.user.lastName}` : null,
    }));
  } else {
    const services = await stockRepo.getServicesByCategoryId(categoryId);
    return services.map(s => ({
      id: s._id,
      name: s.name,
      category: s.category.name,
      wageType: s.wageType,
      cost: s.cost,
      vendorName: s.user ? `${s.user.firstName} ${s.user.lastName}` : null,
    }));
  }
};