// routes/productVendor.routes.js

import { Router } from "express";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getProductVendorsController } from "../controllers/productVendor.controller.js";

const router = Router();

// router.use(verifyJWT(['Admin']));// specify roles if needed

// Protected route: only authenticated users
router.get("/vendors", getProductVendorsController);

export default router;
