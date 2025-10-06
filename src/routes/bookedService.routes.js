

import { Router } from "express";
import {bookServiceController , getBookedServicesByUserAndServiceController, getUserBookedServices,getCompletedBookedServicesController,getUpcomingBookedServicesController } from "../controllers/bookedService.controller.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router = Router();


// JWT-protected route: book a service
router.post("/bookings",  bookServiceController);

// JWT-protected route: get all bookings for a specific service
router.get("/services/:serviceId/bookings",  getBookedServicesByUserAndServiceController);

// Protected route, only for User
router.get('/completed',  getCompletedBookedServicesController);

// ✅ JWT-protected route for user
router.get("/booked-services",  getUserBookedServices);

// Protected route: only User
router.get('/upcoming',  getUpcomingBookedServicesController);

export default router;
