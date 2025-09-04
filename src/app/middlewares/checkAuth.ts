import { Request, Response, NextFunction } from "express";
import AppError from "../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { envVariables } from "../config/env";
import { verifyToken } from "../utils/jwt";
import { User } from "../modules/user/user.model";
import { JwtPayload } from "jsonwebtoken";

// ---------------------- Authentication Middleware ---------------------- //

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extract token from Authorization header or cookies
    const token = req.headers.authorization || req.cookies.accessToken;

    if (!token) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized: No token");
    }

    // Verify token and decode payload
    const decoded = verifyToken(
      token,
      envVariables.JWT_ACCESS_SECRET
    ) as JwtPayload;

    // Ensure user still exists in DB (handles deleted/blocked users)
    const isUserExist = await User.findById(decoded.userId);

    if (!isUserExist) {
      throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
    }

    // Attach decoded token payload to request for access in controllers
    req.user = decoded;
    next();
  } catch (error) {
    // Any failure = unauthorized
    next(
      new AppError(
        StatusCodes.UNAUTHORIZED,
        `Unauthorized: Invalid token ${error}`
      )
    );
  }
};
