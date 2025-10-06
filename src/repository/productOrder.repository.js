import Order from "../models/productOrder.model.js";

export const fetchOrdersWithUsersAndVendors = async (startDate, endDate) => {
  const filter = {};
  if (startDate || endDate) {
    filter.orderDate = {};
    if (startDate) filter.orderDate.$gte = startDate;
    if (endDate) filter.orderDate.$lte = endDate;
  }

  return await Order.find(filter)
    // Fetch the user who placed the order
    .populate("user", "firstName lastName email")

    // Fetch product details and dynamically populate vendor
    .populate({
      path: "products.product",
      select: "name cost user userType",
      populate: {
        path: "user",
        select: "firstName lastName email",
        model: doc => doc.userType // dynamically choose User or Admin
      }
    })
    .sort({ orderDate: -1 });
};
