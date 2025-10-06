// services/admin/admin.service.js
import { ApiError } from '../utils/ApiError.js';
import { findAdminById, findAdminByIdUserType,findAdminByIdWithRefresh, updateAdminRefreshToken } from '../repository/admin.repository.js';
import { findUserById } from "../repository/user.repository.js";
import jwt from "jsonwebtoken";
/**
 * Get admin profile by ID
 * @param {String} adminId
 * @returns {Object} Admin profile
 */
export const getAdminProfileService = async (adminId) => {
  const admin = await findAdminById(adminId);
  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }
  return admin;
};

//  * Get current user info by ID and type
//  * @param {String} userId 
//  * @param {String} userType - 'Admin' or 'User'
//  */
export const getCurrentUserService = async (userId, userType) => {
  let user;

  if (userType === "Admin") {
    user = await findAdminByIdUserType(userId);
  } else {
    user = await findUserById(userId);
  }

  if (!user) {
    throw new ApiError(404, `${userType} not found`);
  }

  return user;
};

export const refreshAccessTokenService = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Refresh token required");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    throw new ApiError(403, "Invalid or expired refresh token");
  }

  const admin = await findAdminByIdWithRefresh(decoded._id);
  if (!admin || admin.refreshToken !== refreshToken) {
    throw new ApiError(403, "Refresh token not valid");
  }

  // generate new tokens
  const newAccessToken = admin.generateAuthToken();
  const newRefreshToken = admin.generateRefreshToken();

  // update in DB
  await updateAdminRefreshToken(admin._id, newRefreshToken);

  return { newAccessToken, newRefreshToken };
};