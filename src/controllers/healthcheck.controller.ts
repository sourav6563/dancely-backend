import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { logger } from "../utils/logger";

export const healthCheck = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Incoming request: [${req.method}] ${req.originalUrl}`);

  const response = new apiResponse(200, "ok", "Health check passed");

  res.status(200).json(response);

  logger.info(`Response sent with status: ${res.statusCode}`);
});
