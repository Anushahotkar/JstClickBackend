// routes/stock.routes.js
import { Router } from "express";
import {getItemsByCategoryController,
     getAllCategoriesForStockController,
     editProductController,
      editServiceController 
     } from "../controllers/stock.controller.js";



const router = Router();

// Optional: Add query validation (if you want filters in future)

router.get("/category-items/:categoryId", getItemsByCategoryController);

router.get("/categories", getAllCategoriesForStockController);

// Product and Service edit endpoints — IDs passed in URL
router.put("/edit/product/:productId", editProductController);
router.put("/edit/service/:serviceId", editServiceController);

export default router;
