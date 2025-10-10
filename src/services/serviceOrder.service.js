import { ApiError } from "../utils/ApiError.js";
import * as repository from "../repository/serviceOrder.repository.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

// Admin: view all booked services
// Admin: view all booked services
export const viewAllBookedServices = async () => {
  const bookings = await repository.fetchAllBookedServices();

  return bookings.map(b => ({
    serviceName: b.service?.name || "N/A",
    username: b.user ? `${b.user.firstName} ${b.user.lastName}` : "Unknown", // booked user
    status: b.status || "Upcoming",
    availedOn: b.bookedDate || b.availedOn,   // depending on schema
    completedOn: b.completedOn || null,
    action: "View / Update"
  }));
};


// Admin: view single booking
export const viewBookedServiceById = async (bookingId) => {
  const booking = await repository.getBookedServiceById(bookingId);
  if (!booking) throw new ApiError(404, "Booking not found");
  return booking;
};

// Admin: assign a service to a user or admin
export const assignVendorToBookingService = async (bookingId, vendorId) => {
  // Check if vendor exists
  let vendor = await User.findById(vendorId);
  if (!vendor) {
    vendor = await Admin.findById(vendorId);
  }
  if (!vendor) throw new ApiError(404, "Vendor/Admin not found");

  const updatedBooking = await repository.assignVendorToBooking(bookingId, vendor._id);
  return updatedBooking;
};


// Update status for a booked service
export const updateBookedServiceStatus = async (bookingId, status, currentUser) => {
  const booking = await repository.getBookedServiceById(bookingId);
  if (!booking) throw new ApiError(404, "Booked service not found");

  // Only the creator of the service can update
  const serviceCreatorId = booking.service.user.toString();
  const serviceCreatorType = booking.service.userType;

  if (
    currentUser._id.toString() !== serviceCreatorId ||
    currentUser.userType !== serviceCreatorType
  ) {
    throw new ApiError(403, "You are not authorized to update this booked service");
  }

  const updates = { status };

  // Automatically set completedOn if status is "Completed"
  if (status === "Completed") {
    updates.completedOn = new Date();
  }

  const updatedBooking = await repository.updateBookedService(bookingId, updates);
  return updatedBooking;
};
