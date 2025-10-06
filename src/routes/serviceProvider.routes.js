// routes/serviceProvider.routes.js
import { Router } from 'express';
import { verifyJWT } from "../middlewares/authMiddleware.js";
import { getServiceProvidersListController } from '../controllers/serviceProvider.controller.js';
import { updateServiceProviderActionController } from "../controllers/serviceProvider.controller.js";

const router = Router();
// router.use(verifyJWT(['Admin'])); // specify roles if needed

// JWT-protected route
router.get('/serviceproviders',  getServiceProvidersListController);

// PATCH: Admin updates action & reason
//service provider id is service id
router.patch(
  "/services/:serviceId/action",
  ...updateServiceProviderActionController
);

export default router;
