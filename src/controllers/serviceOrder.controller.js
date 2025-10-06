import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import * as service from "../services/serviceOrder.service.js";
import { validate } from "../middlewares/validate.js";
import { updateBookedServiceSchema } from "../validations/serviceOrder.validator.js";

import Joi from "joi";

// Joi schema for assignment
export const assignVendorSchema = Joi.object({
  bookingId: Joi.string().hex().length(24).required(),
  vendorId: Joi.string().hex().length(24).required(),
});

// Controller: get all bookings
export const getAllBookedServicesController = asyncHandler(async (req, res) => {
  const bookings = await service.viewAllBookedServices();
  res.json(new ApiResponse(200, bookings, "All booked services fetched successfully"));
});

// Controller: get single booking
export const getBookedServiceByIdController = [
  validate(Joi.object({ bookingId: Joi.string().hex().length(24).required() }), "params"),
  asyncHandler(async (req, res) => {
    const { bookingId } = req.params;
    const booking = await service.viewBookedServiceById(bookingId);
    res.json(new ApiResponse(200, booking, "Booked service fetched successfully"));
  }),
];

// Controller: assign vendor/admin
export const assignVendorController = [
  validate(assignVendorSchema, "body"),
  asyncHandler(async (req, res) => {
    const { bookingId, vendorId } = req.body;
    const updatedBooking = await service.assignVendorToBookingService(bookingId, vendorId);
    res.json(new ApiResponse(200, updatedBooking, "Vendor/Admin assigned successfully"));
  }),
];


// Controller to update status
export const updateBookedServiceStatusController = [
  validate(updateBookedServiceSchema, "body"),
  asyncHandler(async (req, res) => {
    const { bookingId, status } = req.validatedBody;
    const currentUser = req.user; // assuming auth middleware sets req.user

    const updatedBooking = await service.updateBookedServiceStatus(bookingId, status, currentUser);

    res.json(new ApiResponse(200, updatedBooking, "Booked service updated successfully"));
  }),
];