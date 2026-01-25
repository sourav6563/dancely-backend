import { userModel } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { apiResponse } from "../utils/apiResponse";
import { Request, Response } from "express";
import { unlink } from "fs/promises";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary";
import { ALLOWED_IMAGE_TYPES, USER_SENSITIVE_FIELDS } from "../constants";

export const updateName = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  const userId = req.user?._id;

  const user = await userModel
    .findByIdAndUpdate(userId, { $set: { name } }, { new: true })
    .select(USER_SENSITIVE_FIELDS);

  if (!user) {
    throw new ApiError(404, "Name update failed User not found");
  }
  return res.status(200).json(new apiResponse(200, "Name updated successfully", user));
});

export const updateEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  const existingUser = await userModel.findOne({
    email,
    _id: { $ne: req.user?._id },
  });

  if (existingUser) {
    throw new ApiError(409, "Email is already in use");
  }

  const user = await userModel
    .findByIdAndUpdate(req.user?._id, { $set: { email } }, { new: true })
    .select(USER_SENSITIVE_FIELDS);

  if (!user) {
    throw new ApiError(404, "Email update failed User not found");
  }

  return res.status(200).json(new apiResponse(200, "Email updated successfully", user));
});

export const updateProfileImage = asyncHandler(async (req: Request, res: Response) => {
  const profileImageLocalpath = req.file?.path;

  if (!profileImageLocalpath) {
    throw new ApiError(400, "profileImage file is required");
  }

  let profileImage = null;

  try {
    if (!ALLOWED_IMAGE_TYPES.includes(req.file!.mimetype)) {
      throw new ApiError(400, "Invalid profileImage file");
    }

    profileImage = await uploadOnCloudinary(profileImageLocalpath);

    if (!profileImage?.url) {
      throw new ApiError(500, "profileImage upload failed");
    }

    const user = await userModel
      .findByIdAndUpdate(req.user?._id, { $set: { profileImage: profileImage.url } }, { new: true })
      .select(USER_SENSITIVE_FIELDS);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new apiResponse(200, "User profileImage updated successfully", user));
  } catch (error) {
    if (profileImage?.public_id) {
      await deleteOnCloudinary(profileImage.public_id).catch(() => {});
    }
    throw error;
  } finally {
    if (profileImageLocalpath) await unlink(profileImageLocalpath).catch(() => {});
  }
});

export const getUserProfile = asyncHandler(async (req: Request, res: Response) => {
  const { username } = req.params;
  const myId = req.user?._id;

  const profile = await userModel.aggregate([
    // 1. find the user
    {
      $match: {
        username: username.trim().toLowerCase(),
      },
    },

    // 2. who follows this user (followers)
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "following",
        as: "followers",
      },
    },

    // 3. whom this user follows (following)
    {
      $lookup: {
        from: "follows",
        localField: "_id",
        foreignField: "follower",
        as: "following",
      },
    },

    // 4. add computed fields
    {
      $addFields: {
        followersCount: { $size: "$followers" },
        followingCount: { $size: "$following" },

        isFollowedByMe: {
          $cond: {
            if: { $in: [myId, "$followers.follower"] },
            then: true,
            else: false,
          },
        },
      },
    },

    // 5. remove heavy arrays if not needed
    {
      $project: {
        _id: 1,
        username: 1,
        name: 1,
        profileImage: 1,
        isVerified: 1,
        followersCount: 1,
        followingCount: 1,
        isFollowedByMe: 1,
        createdAt: 1,
      },
    },
  ]);

  if (!profile.length) {
    throw new ApiError(404, "User not found");
  }

  return res
    .status(200)
    .json(new apiResponse(200, "User profile fetched successfully", profile[0]));
});

export const getWatchHistory = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 10 } = req.query;
  const userId = req.user?._id;

  const aggregate = userModel.aggregate([
    {
      $match: {
        _id: userId,
      },
    },
    {
      $unwind: "$watchHistory",
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $match: { isPublished: true },
          },
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    name: 1,
                    username: 1,
                    profileImage: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
        ],
      },
    },
    {
      $unwind: "$video",
    },
    {
      $replaceRoot: { newRoot: "$video" },
    },
    {
      $project: {
        _id: 1,
        owner: 1,
        title: 1,
        description: 1,
        views: 1,
        duration: 1,
        createdAt: 1,
        videoFile: "$videoFile.url",
        thumbnail: "$thumbnail.url",
      },
    },
  ]);

  const options = {
    page: parseInt(page as string, 10),
    limit: parseInt(limit as string, 10),
  };

  const watchHistory = await userModel.aggregatePaginate(aggregate, options);

  return res
    .status(200)
    .json(new apiResponse(200, "Watch history fetched successfully", watchHistory));
});
