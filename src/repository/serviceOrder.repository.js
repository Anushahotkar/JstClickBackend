import BookedService from "../models/bookedService.model.js";
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";

// Fetch all booked services (admin view)
export const fetchAllBookedServices = async () => {
  return await BookedService.find()
    .populate("service", "name cost category image")
    .populate("user", "firstName lastName email phone")
    .sort({ bookedDate: -1, bookedTime: 1 });
};

// Fetch a booked service by ID
export const getBookedServiceById = async (bookingId) => {
  return await BookedService.findById(bookingId)
    .populate("service", "name cost category image")
    .populate("user", "firstName lastName email phone")
    .populate("vendor", "firstName lastName email phone");
};

// Assign vendor/admin to a booked service
export const assignVendorToBooking = async (bookingId, vendorId) => {
  const booking = await BookedService.findById(bookingId);
  if (!booking) throw new Error("Booking not found");

  booking.vendor = vendorId;
  await booking.save();

  return getBookedServiceById(bookingId);
};


// Update a booked service
export const updateBookedService = async (bookingId, updates) => {
  return await BookedService.findByIdAndUpdate(bookingId, updates, { new: true })
    .populate("service", "name user userType")
    .populate("user", "firstName lastName email phone")
    .populate("vendor", "firstName lastName email phone");
};