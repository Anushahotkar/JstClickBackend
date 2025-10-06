import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import Admin from '../models/admin.model.js';
import bcrypt from 'bcrypt';
import { getAdminProfileService,getCurrentUserService, refreshAccessTokenService } from "../services/admin.service.js";
import { validate } from "../middlewares/validate.js";
import { loginAdminSchema, getAdminProfileSchema } from "../validations/admin.validation.js";


/**
 * GET /admin/profile
 * Returns profile of logged-in admin
 */
export const getAdminProfile =  // 👈 or "body" if sent in request body
  asyncHandler(async (req, res) => {
    const adminId = req.user._id; // From JWT middleware
    const admin = await getAdminProfileService(adminId);

    if (!admin) {
      throw new ApiError(404, "Admin not found");
    }

    return res.json(
      new ApiResponse(200, admin, "Admin profile fetched successfully")
    );
  })
;

export const login = [
  
validate(loginAdminSchema, "body"),
asyncHandler(async (req, res) => {
  //  console.log("0000000 hello ---------------");
   
  const { identifier, password } = req.body;
  console.log("🚀 ~ login ~ req.body:", req.body);

  // Validate input
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;

  if (!identifier || !password) {
    throw new ApiError(400, 'Identifier and password are required');
  }

  if (!emailRegex.test(identifier) && !phoneRegex.test(identifier)) {
    throw new ApiError(400, 'Invalid email or phone format');
  }

  // Find admin by email or phone
  const query = emailRegex.test(identifier)
    ? { email: identifier }
    : { phone: identifier };
  const admin = await Admin.findOne(query);

  if (!admin) {
    throw new ApiError(404, 'Admin not found');
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, admin.password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid password');
  }

  // Generate tokens
  const accessToken = admin.generateAuthToken();
  const refreshToken = admin.generateRefreshToken();

  // Save refresh token
  admin.refreshToken = refreshToken;
  await admin.save();

  // Set access token in cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'None',
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  // Prepare admin data (exclude sensitive fields)
  const adminData = { ...admin._doc, password: undefined, refreshToken: undefined };

  return res.json(
    new ApiResponse(
      200,
      { user: adminData, accessToken, refreshToken },
      'Login successful'
    )
  );
})
];


/**
 * GET /auth/me
 */
export const getCurrentUserController = asyncHandler(async (req, res) => {
  const { _id, userType } = req.user; // Comes from JWT middleware

  const user = await getCurrentUserService(_id, userType);

  return res.json(new ApiResponse(200, user, "User fetched successfully"));
});


export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;

  const { newAccessToken, newRefreshToken } =
    await refreshAccessTokenService(refreshToken);

  // set cookie
  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "None",
    maxAge: 60 * 60 * 1000, // 1 hour
  });

  return res.json(
    new ApiResponse(
      200,
      { accessToken: newAccessToken, refreshToken: newRefreshToken },
      "Token refreshed"
    )
  );
});