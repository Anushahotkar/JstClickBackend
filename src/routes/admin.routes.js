/*admin.routes.js*/

import { Router } from 'express';
import { attachFileToBody } from "../middlewares/attachFileToBody.js";
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { login } from '../controllers/admin.controller.js';
import { getAdminProfile,getCurrentUserController, refreshAccessTokenController } from '../controllers/admin.controller.js';
import categoryRoutes from "./category.routes.js";
import adminCategoryRoutes from "./adminCategory.routes.js";
import serviceRoutes from "./service.routes.js";
import productRoutes from "./product.routes.js";
import { updateServiceController,deleteServiceController,getServiceProvidersList } from '../controllers/service.controller.js';
import {uploadServiceImage} from "../middlewares/ServiceUpload.js";
import upload from '../middlewares/uploadProduct.js';
import { updateProductController,deleteProductController,  } from '../controllers/product.controller.js';
import serviceProviderRoutes from "./serviceProvider.routes.js";
import productVendorListRoutes from "./productVendor.routes.js";
import serviceOrderRoutes from "./serviceOrder.routes.js";
import productOrderRoutes from "./productOrder.routes.js";

const router = Router();



// Unprotected route
router.post('/login', login);
// console.log("🚀 ~ router ~ router:", router);

// Protected routes
router.use(verifyJWT(['Admin']));

// Placeholder protected route
router.post("/refresh", refreshAccessTokenController);
// Protected route: Only Admin can access
router.get('/profile', getAdminProfile);
router.get("/me", getCurrentUserController);
router.use("/productVendor",productVendorListRoutes);
router.use("/api/serviceProvider",serviceProviderRoutes);
router.use('/api/category', categoryRoutes);
router.use('/api/adminCategory', adminCategoryRoutes);
router.use('/api/services', serviceRoutes);
router.use('/api/products', productRoutes);
router.use("/api/serviceOrder",serviceOrderRoutes);
router.use("/api/productOrder",productOrderRoutes);
// Route to get the list of all service providers.
// It requires JWT validation to ensure only authorized users can access it.



// Update service
router.put("/services/:serviceId",uploadServiceImage, 
     attachFileToBody("image"),
    updateServiceController);

// Delete service
router.delete("/services/:serviceId", deleteServiceController);

//update product
router.put("/products/:productId", upload.single("image"),attachFileToBody("image"), updateProductController);

// Delete service
router.delete("/products/:productId", deleteProductController);



export default router;