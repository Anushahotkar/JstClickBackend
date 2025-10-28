



import { Router } from "express";
import { attachFileToBody } from "../middlewares/attachFileToBody.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
// import { upload } from "../middlewares/uploadMiddleware.js";
import { getProductsByCategoryController
  ,addProduct,getProductController
  ,getCategoryNameByProductController } from "../controllers/product.controller.js";
import upload from "../middlewares/uploadProduct.js";


const router = Router();



// ✅ Protected route for users to fetch products by category
router.get("/products/:categoryId", getProductsByCategoryController);

// Only authenticated Users can add products
router.post(
  "/products",

  upload.single("image"), // single image field // field name = "images"
  (req, res, next) => {
    console.log("🚀 req.file from Multer:", req.file);
    next();
  },
  // (req, res, next) => console.log("🚀 Incoming request body after upload:", req.body),
  attachFileToBody("image"),
    //  (req, res, next) => console.log("🚀 Incoming request body after attachFileToBody and upload:", req.body),
   // attach to req.body.image
  addProduct
);

// GET category name for a product
router.get("/product/:productId/category"
  , getCategoryNameByProductController);
// Protected route: only users
router.get("/:productId", getProductController);

export default router;
