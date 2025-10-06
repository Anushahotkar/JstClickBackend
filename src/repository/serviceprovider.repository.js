/*serviceprovider.repository.js*/

// repositories/serviceProvider.repository.js
import User from "../models/user.model.js";
import Admin from "../models/admin.model.js";
import ServiceProvider from "../models/serviceProvider.model.js";
import Service from "../models/service.model.js";

// Get users/admins who posted services in ServiceProvider format
// Fetch ServiceProvider record by serviceId
// Fetch all services with user/admin populated
export const getServiceProvidersWithActions = async () => {
  // fetch all services
  const services = await Service.find().populate("user").lean();

  // fetch all serviceProvider records
  const serviceProviders = await ServiceProvider.find().lean();
  const spMap = new Map();
  serviceProviders.forEach(sp => {
    spMap.set(sp.serviceId.toString(), sp);
  });

  // collect userIds
  const userIds = [...new Set(services.map(s => s.user?._id?.toString()).filter(Boolean))];

  const users = await User.find({ _id: { $in: userIds } }).lean();
  const admins = await Admin.find({ _id: { $in: userIds } }).lean();

  const userMap = new Map();
  users.forEach(u => userMap.set(u._id.toString(), { ...u, role: "User" }));
  admins.forEach(a => userMap.set(a._id.toString(), { ...a, role: "Admin" }));

  // map response
  return services.map(service => {
    const user = service.user ? userMap.get(service.user._id.toString()) : null;
    const sp = spMap.get(service._id.toString());

    return {
      _id: service._id,
      name: user
        ? user.role === "Admin"
          ? "JSTcliq"
          : `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.businessName || "Unknown"
        : "Unknown",
      profileImage: user?.profileImage?.url || null,
      serviceType: service.name,
      cost: service.cost,
      ratings: 0, // default rating 0
      action: sp?.action || "Pending", // ✅ take from ServiceProvider model
      reason: sp?.reason || "",         // ✅ take from ServiceProvider model
    };
  });
};


// Update action & reason
export const updateServiceProviderAction = async (providerId, action, reason) => {
  return await ServiceProvider.findByIdAndUpdate(
    providerId,
    { action, reason },
    { new: true }
  ).lean();
};

export const createServiceProviderAction = async ({ userId, serviceId, action, reason }) => {
  const provider = new ServiceProvider({ userId, serviceId, action, reason });
  return await provider.save();
};



export const findServiceWithUser = async (serviceId) => {
  return await Service.findById(serviceId).populate("user").lean();
};