// services/productVendor.service.js
import * as repo from "../repository/productVendor.repository.js";

export const fetchProductVendorsService = async () => {
  const products = await repo.getAllProductVendors();

  const vendorsMap = new Map();

  products.forEach(product => {
    const user = product.user;
    if (!user) return;

    const userId = user._id.toString();

    if (!vendorsMap.has(userId)) {
      vendorsMap.set(userId, {
        shopName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unknown Vendor',
        productType: product.name || 'Unknown Product',
        cost: product.cost || 0,
        rating: 0,        // default rating
        action: "Dropdown", // default
        reason: '',        // default blank
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      });
    } else {
      // optional: you can append multiple product names if vendor posted many products
      const existing = vendorsMap.get(userId);
      existing.productType += `, ${product.name}`; 
      vendorsMap.set(userId, existing);
    }
  });

  return Array.from(vendorsMap.values());
};
