import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { ApiError } from "../utils/apiError";

export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  PARAM = "params",
  HEADER = "headers",
}

export const validate =
  (schema: ZodTypeAny, source: ValidationSource = ValidationSource.BODY) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      throw new ApiError(400, "Validation failed", result.error.format());
    }

    req[source] = result.data;
    next();
  };
