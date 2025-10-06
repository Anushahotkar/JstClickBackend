// services/userAuth.service.js
import { ApiError } from '../utils/ApiError.js';
import { 
  createUser, 
  findUserByEmail, 
  findUserByPhone,
   saveUserOtp,
  clearUserOtp,
  saveRefreshToken,
  findUserById,
   updateUserProfile
 } from '../repository/user.repository.js';


export const getUserProfileService = async (userId) => {
  const user = await findUserById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

export const updateUserProfileService = async (userId, updateData) => {
  const allowedFields = ["firstName", "lastName", "businessName", "email", "phone", "address", "profileImage"];
  const safeData = {};

  // Only allow editable fields
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      safeData[field] = updateData[field];
    }
  });

  
  const updatedUser = await updateUserProfile(userId, safeData);
  if (!updatedUser) throw new ApiError(404, "User not found");

  return updatedUser;
};


// Generate random 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (userData) => {
  const { firstName, lastName, email, phone } = userData;

  // 1. Check required fields
  if (!firstName || !lastName || !email || !phone) {
    throw new ApiError(400, 'All required fields must be provided');
  }

  // 2. Check duplicate email
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw new ApiError(409, 'Email already registered');
  }

  // 3. Check duplicate phone
  const existingPhone = await findUserByPhone(phone);
  if (existingPhone) {
    throw new ApiError(409, 'Phone number already registered');
  }

  // 4. Create user
  const newUser = await createUser(userData);

  // 5. Generate tokens
  const accessToken = newUser.generateAuthToken();
  const refreshToken = newUser.generateRefreshToken();

  // Save refresh token
  newUser.refreshToken = refreshToken;
  await newUser.save();

  return { newUser, accessToken, refreshToken };
};




/**
 * Step 1: Request OTP
 */
export const requestOtpService = async (phone) => {
  if (!phone) throw new ApiError(400, 'Phone number is required');

  const user = await findUserByPhone(phone);
  if (!user) throw new ApiError(404, 'User not found with this phone');

  const otp = generateOtp();
  const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

  await saveUserOtp(phone, otp, otpExpiry);

  // In production: send via SMS (Twilio, MSG91, etc.)
  return { phone, otp }; // returning OTP only for testing
};

/**
 * Step 2: Verify OTP and login
 */
export const loginWithOtpService = async (phone, otp) => {
  if (!phone || !otp) throw new ApiError(400, 'Phone and OTP are required');

  const user = await findUserByPhone(phone);
  if (!user) throw new ApiError(404, 'User not found');

  // Validate OTP
  if (
    !user.otp ||
    user.otp !== otp ||
    !user.otpExpiry ||
    Date.now() > user.otpExpiry
  ) {
    throw new ApiError(401, 'Invalid or expired OTP');
  }

  // Clear OTP after successful login
  await clearUserOtp(phone);

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = user.generateRefreshToken();

  await saveRefreshToken(user._id, refreshToken);

  return { user, accessToken, refreshToken };
};