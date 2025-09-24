/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";

// ---------------------- Request Validation Middleware ---------------------- //

export const validateRequest = (schema: ZodSchema<any>) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      let body = req.body;

      // If request contains nested "data" (e.g., multipart/form-data with JSON inside "data")
      if (body?.data) {
        try {
          body = JSON.parse(body.data);
        } catch (e) {
          res.status(400).json({
            success: false,
            message: "Invalid JSON in 'data' field",
          });
          return;
        }
      }

      // Validate request body
      req.body = await schema.parseAsync(body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation Error",
          errors: error.issues,
        });
        return;
      }
      next(error);
    }
  };
};
