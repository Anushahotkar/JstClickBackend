import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import * as repo from "../repository/productVendor.repository.js";
import { calculateAverageRating } from "../utils/rating.utils.js";

export const fetchProductVendorsService = async () => {
  const products = await repo.getAllProductVendors();

  const vendorsMap = new Map();

  products.forEach(product => {
    const user = product.user;
    if (!user) return;

    const userId = user._id.toString();

    if (!vendorsMap.has(userId)) {
      vendorsMap.set(userId, {
        shopName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unknown Vendor",
        productType: product.name || "Unknown Product",
        cost: product.cost || 0,
        rating: calculateAverageRating(product.ratings || []),
        action: "Dropdown",
        reason: "",
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        productsCount: 1,
      });
    } else {
      const existing = vendorsMap.get(userId);
      existing.productType += `, ${product.name}`;
      existing.productsCount += 1;
      vendorsMap.set(userId, existing);
    }
  });

  return Array.from(vendorsMap.values());
};