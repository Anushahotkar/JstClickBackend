// controllers/admin/order.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getOrders } from "../services/productOrder.service.js";
import { validate } from "../middlewares/validate.js";
import { getOrdersSchema } from "../validations/productOrder.validation.js";

export const getOrdersController = [
  validate(getOrdersSchema, "query"),
  asyncHandler(async (req, res) => {
  // Example for GET orders
const { startDate, endDate } = req.validatedQuery;

    const orders = await getOrders(startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null);
    res.json(new ApiResponse(200, orders, "Orders fetched successfully"));
  }),
];
