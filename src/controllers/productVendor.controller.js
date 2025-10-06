// controllers/productVendor.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as service from "../services/productVendor.service.js";
import { validate } from "../middlewares/validate.js";
import { getProductVendorsSchema } from "../validations/productVendor.validation.js";

// GET all product vendors
export const getProductVendorsController =[
    validate(getProductVendorsSchema,"body"), 
asyncHandler(async (req, res) => {
  const vendors = await service.fetchProductVendorsService();
  res.json(new ApiResponse(200, vendors, "Product vendors fetched successfully"));
})
];
