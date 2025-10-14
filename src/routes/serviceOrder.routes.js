import { Router } from "express";
import {
  getAllBookedServicesController,
  getBookedServiceByIdController,
  assignVendorController,
  updateBookedServiceStatusController,
  vendorAcceptController,
  vendorRejectController,
  completeBookingController,
  getBookingsController,
} from "../controllers/serviceOrder.controller.js";


const router = Router();

// All routes require authentication


// Admin routes
router.get("/", getAllBookedServicesController);
router.get("/:bookingId", 
  getBookedServiceByIdController);
router.post("/assign-vendor", 
  assignVendorController);
router.patch("/update-status", 
  updateBookedServiceStatusController);

  // Vendor actions
router.post("/accept",
   vendorAcceptController);
router.post("/reject", 
  vendorRejectController);

// User completes booking
router.post("/complete",
   completeBookingController);

router.get("/serviceOrder"
  , getBookingsController);


export default router;
