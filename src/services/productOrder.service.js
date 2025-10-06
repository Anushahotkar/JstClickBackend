// services/admin/order.service.js
import * as orderRepo from "../repository/productOrder.repository.js";

export const getOrders = async (startDate, endDate) => {
  return await orderRepo.fetchOrdersWithUsersAndVendors(startDate, endDate);
};
