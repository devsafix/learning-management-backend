/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errorHelpers/AppError";
import { userRoles } from "./user.constant";
import { StatusCodes } from "http-status-codes";

const getAllUsers = async () => {
  console.log("Fetching all users from database");

  const users = await User.find().select("-password").sort({ createdAt: -1 });

  console.log(`Found ${users.length} users`);
  return users;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decoded: JwtPayload
) => {
  console.log("Update user service called:", { userId, payload, decoded });

  const isSelf = userId === decoded.userId;
  const isAdmin = decoded.role === userRoles.ADMIN;

  // Check if user exists
  const exists = await User.findById(userId);
  if (!exists) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  // Authorization logic: Admin can update anyone, users can only update themselves
  if (!isSelf && !isAdmin) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not authorized to update this user"
    );
  }

  // If user is updating themselves and not admin, remove sensitive fields
  if (isSelf && !isAdmin) {
    delete (payload as any).role;
    delete (payload as any).isVerified;
    delete (payload as any).isBlocked;
    console.log("Non-admin user updating self, removed sensitive fields");
  }

  // If admin is updating, allow all fields
  console.log("Updating user with payload:", payload);

  const updatedUser = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");

  if (!updatedUser) {
    throw new AppError(StatusCodes.NOT_FOUND, "Failed to update user");
  }

  console.log("User updated successfully");
  return updatedUser;
};

const blockUser = async (userId: string) => {
  console.log("Block user service called:", userId);

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is already blocked");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: true },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to block user"
    );
  }

  console.log("User blocked successfully");
  return updatedUser;
};

const unblockUser = async (userId: string) => {
  console.log("Unblock user service called:", userId);

  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (!user.isBlocked) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not blocked");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { isBlocked: false },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) {
    throw new AppError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to unblock user"
    );
  }

  console.log("User unblocked successfully");
  return updatedUser;
};

const getSingleUser = async (id: string) => {
  console.log("Get single user service called:", id);

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  console.log("User found successfully");
  return {
    data: user,
  };
};

const getMe = async (userId: string) => {
  console.log("Get me service called:", userId);

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  console.log("Current user profile retrieved successfully");
  return {
    data: user,
  };
};

export const UserServices = {
  getAllUsers,
  updateUser,
  getSingleUser,
  getMe,
  blockUser,
  unblockUser,
};
