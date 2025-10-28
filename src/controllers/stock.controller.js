// controllers/stock.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { getAllCategoriesForStock, getItemsByCategory } from "../services/stock.service.js";
import { validate } from "../middlewares/validate.js";

import { getCategoriesSchema,
    getItemsByCategorySchema,
    getItemsTypeSchema
 } from "../validations/stock.validation.js";

export const getAllCategoriesForStockController =[
     validate(getCategoriesSchema, "query"),
     asyncHandler(async (req, res) => {
  const categories = await getAllCategoriesForStock();
  res.json(new ApiResponse(200, categories, "Service and Product categories fetched successfully"));
})
] ;


export const getItemsByCategoryController = [
  validate(getItemsByCategorySchema, "params"),
   validate(getItemsTypeSchema, "query"),
  asyncHandler(async (req, res) => {
    const { categoryId } = req.validatedBody || req.params; // get categoryId from params
const { type } = req.validatedQuery || req.query;
    const items = await getItemsByCategory(categoryId, type);
    res.json(new ApiResponse(200, items, `${type} items fetched successfully`));
  })
];