import { Video } from "../models/video.model";
import { ApiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
// import { logger } from "../utils/logger";
import { Follow } from "../models/follow.model";
import { Like } from "../models/like.model";

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized request");
  }

  const videoStats = await Video.aggregate([
    {
      $match: {
        owner: userId, // Filter: My Videos
      },
    },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 }, // Count of videos
        totalViews: { $sum: "$views" }, // Sum of views
      },
    },
  ]);

  const followerStats = await Follow.aggregate([
    {
      $match: {
        following: userId,
      },
    },
    {
      $count: "followersCount",
    },
  ]);

  const likeStats = await Like.aggregate([
    {
      $match: {
        video: { $exists: true }, // Only consider video likes
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails",
      },
    },
    {
      $unwind: "$videoDetails",
    },
    {
      $match: {
        "videoDetails.owner": userId, // Filter: My Content
      },
    },
    {
      $count: "totalLikes",
    },
  ]);

  const stats = {
    totalVideos: videoStats[0]?.totalVideos || 0,
    totalViews: videoStats[0]?.totalViews || 0,
    totalFollowers: followerStats[0]?.followersCount || 0,
    totalLikes: likeStats[0]?.totalLikes || 0,
  };

  return res.status(200).json(new apiResponse(200, "Dashboard stats fetched successfully", stats));
});

// export const getVideos = asyncHandler(async (req: Request, res: Response) => {
//   const userId = req.user?._id;

//   if (!userId) {
//     throw new ApiError(401, "Unauthorized");
//   }

//   try {
//     const videos = await Video.find({ owner: userId })
//       .sort({ createdAt: -1 }) // newest first
//       .populate("owner", "username fullname profileImage");

//     return res.status(200).json(new apiResponse(200, "User videos fetched successfully", videos));
//   } catch (error) {
//     logger.error("getUserVideos error:", error);
//     throw new ApiError(500, "Failed to fetch user videos");
//   }
// });
