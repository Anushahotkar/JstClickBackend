import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import { calculateAverageRating } from "../utils/rating.utils.js";

export const fetchProductVendorsService = async () => {
  // Fetch all products
  const products = await Product.find().lean();

  // Extract unique user IDs from products
  const userIds = [...new Set(products.map(p => p.user?.toString()).filter(Boolean))];

  // Fetch user/admin details
  const users = await User.find({ _id: { $in: userIds } }).lean();
  const admins = await Admin.find({ _id: { $in: userIds } }).lean();

  // Combine into a single map
  const allUsers = [...users, ...admins];
  const userMap = new Map();
  allUsers.forEach(u => userMap.set(u._id.toString(), u));

  // Build product vendors list
  const vendorsList = [];

  products.forEach(product => {
    if (!product.user) return;

    const userId = product.user.toString();
    const user = userMap.get(userId);

    // Determine shopName
    const shopName = user?.userType === "Admin"
      ? "JSTcliq"
      : `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || "Unknown Vendor";

    vendorsList.push({
      shopName,
      productType: product.name || "Unknown Product",
      cost: product.cost || 0,
      rating: calculateAverageRating(product.ratings || []),
      action: "Dropdown",  // default
      reason: "",          // default
      createdAt: product.createdAt,
      productsCount: 1,    // each entry represents one product
    });
  });

  return vendorsList;
};
