import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import bcrypt from "bcrypt";
import { ApiError} from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber },]
  });
  if (existingUser) throw new ApiError(400, "Email or Phone number already exists");

  let profilePictureUrl = null;
  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult && uploadResult.url) profilePictureUrl = uploadResult.url;
  }

  const newUser = new User({
    username,
    email,
    phoneNumber,
    password,
  });

  await newUser.save();

  res.status(201).json(new ApiResponse(201, null, "User registered successfully"));
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json(new ApiResponse(200, {
    accessToken,
    refreshToken,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      profilePicture: user.profilePicture,
      role: user.role,
    },
  }));
});

export const updateUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const updateData = { ...req.body };

  if (req.file) {
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (uploadResult && uploadResult.url) updateData.profilePicture = uploadResult.url;
  }

  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) throw new ApiError(404, "User not found");

  const { password, refreshToken, ...userData } = updatedUser.toObject();

  res.status(200).json(new ApiResponse(200, userData, "User updated"));
});

export const logoutUser = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) throw new ApiError(400, "Refresh token required");

  const user = await User.findOne({ refreshToken });
  if (!user) throw new ApiError(400, "Invalid refresh token");

  user.refreshToken = null;
  await user.save();

  res.status(200).json(new ApiResponse(200, null, "Logged out successfully"));
});
