// controllers/serviceProvider.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
getServiceProvidersListService,
  updateServiceProviderActionService,
getApprovedProvidersByServiceNameService,
} from "../services/serviceProvider.service.js";
import { validate } from "../middlewares/validate.js";
import { updateServiceProviderActionSchema } from "../validations/serviceProvider.validation.js";

// GET ServiceProvider info
export const getServiceProvidersListController = asyncHandler(async (req, res) => {
  const providers = await getServiceProvidersListService();
  return res
    .status(200)
    .json(new ApiResponse(200, providers, "Service providers list fetched successfully."));
});


// PATCH: update action & reason
export const updateServiceProviderActionController = [
  validate(updateServiceProviderActionSchema, "body"),
  asyncHandler(async (req, res) => {
    const { serviceId } = req.params;
    const { action, reason } = req.validatedBody;

    const updatedProvider = await updateServiceProviderActionService(serviceId, action, reason);

    return res
      .status(200)
      .json(new ApiResponse(200, updatedProvider, "ServiceProvider action updated successfully"));
  }),
];

// GET /user/service-providers



// GET /user/service-providers/by-name/:serviceName
export const getApprovedProvidersByServiceNameController = asyncHandler(
  async (req, res) => {
    const { serviceName } = req.params;
    const providers = await getApprovedProvidersByServiceNameService(serviceName);

    return res.status(200).json(
      new ApiResponse(200, providers, `Approved providers for '${serviceName}' fetched successfully`)
    );
  }
);


