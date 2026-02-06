import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from "cloudinary";
import { unlink } from "fs/promises";
import { existsSync } from "fs";
import { logger } from "../utils/logger";
import { env } from "../env";

// Configure cloudinary with timeout for large uploads
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  timeout: 600000, // 10 minutes timeout for large uploads
});

const uploadOnCloudinary = async (
  localFilePath: string,
  options: UploadApiOptions = { resource_type: "auto" },
): Promise<UploadApiResponse | null> => {
  try {
    if (!localFilePath) return null;

    // Use upload_large for video files (handles chunking for files >100MB)
    // upload_large automatically chunks the file and handles large uploads
    let response: UploadApiResponse;

    if (options.resource_type === "video") {
      // upload_large with chunk_size for videos >100MB
      response = (await cloudinary.uploader.upload_large(localFilePath, {
        ...options,
        chunk_size: 20000000, // 20MB chunks
      })) as UploadApiResponse;
    } else {
      response = await cloudinary.uploader.upload(localFilePath, options);
    }

    logger.info(`File uploaded on cloudinary: ${response.secure_url}`);

    // Once the file is uploaded, delete the local file
    await unlink(localFilePath);

    return response;
  } catch (error) {
    logger.error("Error uploading file to cloudinary:", error);

    // Clean up local file even if upload fails
    try {
      if (existsSync(localFilePath)) {
        await unlink(localFilePath);
      }
    } catch (unlinkError) {
      logger.error("Error deleting local file:", unlinkError);
    }

    return null;
  }
};

const deleteOnCloudinary = async (publicId: string): Promise<{ result: string } | null> => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    logger.info(`File deleted from cloudinary. publicId: ${publicId}`);
    return result;
  } catch (error) {
    logger.error("Error while deleting file on cloudinary:", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteOnCloudinary };
