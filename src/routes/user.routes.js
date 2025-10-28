/*user.routes.js*/

import { Router } from 'express';
import { verifyJWT } from '../middlewares/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { register,requestOtp, login, getProfile, updateProfile } from '../controllers/user.controller.js';
import { upload } from "../middlewares/uploadMiddleware.js";
import categoryRoutes from "./category.routes.js";
import serviceRoutes from "./service.routes.js";
import productRoutes from "./product.routes.js";
import bookingRoutes from "./bookedService.routes.js";
import orderRoutes from "./order.routes.js";
import {
  updateBookedServiceStatusController,
} from "../controllers/serviceOrder.controller.js";
import cartRoutes from "./cart.routes.js";
const router = Router();

// Unprotected route

// Registration route
router.post('/register', register);
// OTP login flow
router.post('/request-otp', requestOtp);
router.post('/login', login);

// Protected routes
router.use(verifyJWT(['User']));


router.get("/profile", getProfile);

//service categories
// JWT-protected route for users
router.use('/api/services', serviceRoutes);
router.use('/api/categories', categoryRoutes);
router.put("/profile",upload.single("profileImage"), updateProfile);

router.use('/api/products', productRoutes);
router.use('/api/bookings', bookingRoutes);
router.use('/api/orders', orderRoutes);
router.use('/cart',cartRoutes);

// Only authenticated users can update
router.patch("/update-status",  updateBookedServiceStatusController);

// Placeholder protected route
router.get('/dashboard', asyncHandler(async (req, res) => {
  return res.json(new ApiResponse(200, {}, 'User dashboard accessed'));
}));

export default router;