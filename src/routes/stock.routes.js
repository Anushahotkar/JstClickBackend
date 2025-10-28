// routes/stock.routes.js
import { Router } from "express";
import {getItemsByCategoryController,
     getAllCategoriesForStockController,
     } from "../controllers/stock.controller.js";

import Joi from "joi";

const router = Router();

// Optional: Add query validation (if you want filters in future)

router.get("/category-items/:categoryId", getItemsByCategoryController);

router.get("/categories", getAllCategoriesForStockController);

export default router;
