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
  const services = await Service.find()
  .populate("user")
  .sort({ createdAt: -1 }) // latest first
  .lean();

  // fetch all serviceProvider records
  const serviceProviders = await ServiceProvider
  .find().lean();
  const spMap = new Map();
  serviceProviders.forEach(sp => {
    spMap.set(sp.serviceId.toString(), sp);
  });

  
 // 3️⃣ Filter out Admins
  const users = await User.find({
    _id: { $in: services.map(s => s.user?._id).filter(Boolean) },
    userType: { $ne: "Admin" } // exclude Admins
  }).lean();

  const userMap = new Map();
  users.forEach(u => userMap.set(u._id.toString(), { ...u, role: "User" }));
   
   // 4️⃣ Map services to response
  const result = services
    .map(service => {
      const user = service.user ? userMap.get(service.user._id.toString()) : null;

      // Skip services that are admin-provided
      if (!user) return null;

      const sp = spMap.get(service._id.toString());


  // map response
  

   return {
        _id: service._id,
        name:
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          user.businessName ||
          "Unknown",
        profileImage: user.profileImage || null,
        serviceType: service.name,
        cost: service.cost,
        ratings: 0, // default, can compute later if needed
        action: sp?.action || "Pending",
        reason: sp?.reason || "",
        createdAt: service.createdAt,
      };
    })
    .filter(Boolean); // remove nulls (Admin services)

  return result;     // ✅ take from ServiceProvider model
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

// Find a ServiceProvider record by serviceId
export const findServiceProviderByServiceId = async (serviceId) => {
  return await ServiceProvider.findOne({ serviceId })
  .populate("userId", "firstName lastName phone")
  .lean();
};

// Fetch approved providers (users/admin) by service name
export const fetchApprovedProvidersByServiceName = async (serviceName) => {
  // Find service(s) by name
  const services = await Service
  .find({ name: serviceName }).lean();
  if (!services || services.length === 0) return [];

  const serviceIds = services.map(s => s._id);

  // Fetch approved ServiceProvider records
  const approvedProviders = await ServiceProvider.find({
    serviceId: { $in: serviceIds },
    action: "Approved",
  })
    .populate("userId", "firstName lastName phone") // populate user info
    .lean();

  // Map users
  const users = approvedProviders.map(sp => {
    const user = sp.userId;
    return {
      _id: user?._id,
      name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Unknown",
      phone: user?.phone || null,
      rating: 5, // static rating
      type: "User",

    };
  });

  // Add Admin (JustCliq) as static provider
  const admins = await Admin.find().select("firstName lastName phone").lean();
  const adminProviders = admins.map(a => ({
    _id: a._id,
    name: `${a.firstName} ${a.lastName}`,
    phone: a.phone,
    rating: 5, // static rating
    type: "Admin",
   
  }));

  return [...users, ...adminProviders];
};