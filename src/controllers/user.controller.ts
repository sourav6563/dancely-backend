import { Types } from "mongoose";
import { userModel } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { logger } from "../utils/logger";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary";

export const generateAccessAndRefreshToken = async (userId: string | Types.ObjectId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error("Error in generateAccessAndRefreshToken:", error);
    throw new ApiError(500, "something went wrong while generating access and refresh token");
  }
};

export const signUpUser = asyncHandler(async (req, res) => {
  //
  const { fullname, email, username, password } = req.body;

  const existedUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new ApiError(409, "User with same username or email already exists");
  }
  const profileImagepath = req.files?.profileImage?.[0]?.path;

  let profileImage = null;
  if (profileImagepath) {
    try {
      profileImage = await uploadOnCloudinary(profileImagepath);
      logger.info(`file uploaded on cloudinary: ${JSON.stringify(profileImage)}`);
    } catch (error) {
      logger.error(`Error while uploading profileImage`, error);
      throw new ApiError(500, "something went wrong while uploading profileImage");
    }
  }

  const profileUrl =
    profileImage?.url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullname)}&background=random`;

  try {
    const user = await userModel.create({
      fullname,
      profileImage: profileUrl,
      username: username,
      email,
      password,
    });
    const createdUser = await userModel.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      throw new ApiError(500, "something went wrong while signUp User");
    }
    return res.status(201).json(new apiResponse(201, createdUser, "User signUp successfully"));
  } catch (error) {
    logger.error(`Error while creating user`, error);
    if (profileImage) {
      await deleteOnCloudinary(profileImage.public_id);
    }
    throw new ApiError(500, "something went wrong while signUp the user");
  }
});
