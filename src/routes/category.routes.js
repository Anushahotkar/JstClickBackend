import { Router } from "express";
import { getCategoriesController,
    getServiceController,
getProductCategoriesController } from "../controllers/category.controller.js";

// import { getProductCategoriesController } from "../controllers/category.controller.js";

const router = Router();

//service categories
// JWT-protected route for users
router.get("/service-categories",  getCategoriesController);

//product categories
// ✅ Protected route
// ✅ Product categories (fruits, vegetables, grocery, chocolates, dairy, etc.)
router.get("/product-categories",  getProductCategoriesController);

// Protected route: only users
router.get("/:serviceId", getServiceController);






export default router;
