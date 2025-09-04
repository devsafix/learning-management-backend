import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";

// ---------------------- Role-Based Authorization Middleware ---------------------- //

export const checkRole =
  (...allowedRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRole = req.user?.role; // Comes from checkAuth middleware

      if (!userRole || !allowedRoles.includes(userRole)) {
        return next(
          new AppError(StatusCodes.FORBIDDEN, "Forbidden: Access denied")
        );
      }

      next();
    } catch (error) {
      next(
        new AppError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          `Internal server error ${error}`
        )
      );
    }
  };
