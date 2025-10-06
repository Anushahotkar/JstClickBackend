import { Router } from "express";
import {
  getAllBookedServicesController,
  getBookedServiceByIdController,
  assignVendorController,
  updateBookedServiceStatusController,
} from "../controllers/serviceOrder.controller.js";


const router = Router();

// All routes require authentication


// Admin routes
router.get("/", getAllBookedServicesController);
router.get("/:bookingId", getBookedServiceByIdController);
router.post("/assign-vendor", assignVendorController);
router.patch("/update-status", updateBookedServiceStatusController);

export default router;
