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
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
        code: issue.code,
      }));

      throw new ApiError(400, "Validation failed", errors);
    }

    req[source] = result.data;
    next();
  };
