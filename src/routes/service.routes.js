import { Router } from "express";
import {
  getServicesByCategoryController,
  addUserServiceController,
  
} from "../controllers/service.controller.js";
import { uploadServiceImage } from "../middlewares/ServiceUpload.js";
import { attachFileToBody } from "../middlewares/attachFileToBody.js";

const router = Router();

// Create service
router.post("/services", uploadServiceImage,
   attachFileToBody("image"),
  addUserServiceController);

// Read services by category
router.get("/service-categories/:categoryId", getServicesByCategoryController);


export default router;
