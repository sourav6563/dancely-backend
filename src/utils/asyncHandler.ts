import { Request, Response, NextFunction } from "express";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await fn(req, res, next); // run the async function
    } catch (error) {
      next(error); // pass error to Express error handler
    }
  };
};

export { asyncHandler };
