/* eslint-disable @typescript-eslint/no-explicit-any */
import { JwtPayload } from "jsonwebtoken";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errorHelpers/AppError";
import { userRoles } from "./user.constant";
import { StatusCodes } from "http-status-codes";

const getAllUsers = async () => {
  const users = await User.find().select("-password");
  return users;
};

const updateUser = async (
  userId: string,
  payload: Partial<IUser>,
  decoded: JwtPayload
) => {
  const isSelf = userId === decoded.userId;
  const isAdmin = decoded.role === userRoles.ADMIN;

  if (!isSelf) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
  }

  if (!isAdmin) {
    // normal user cannot elevate or toggle sensitive flags
    delete (payload as any).role;
    delete (payload as any).isVerified;
    delete (payload as any).isBlocked;
  }

  const exists = await User.findById(userId);
  if (!exists) throw new AppError(StatusCodes.NOT_FOUND, "User Not Found");

  return User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  }).select("-password");
};

const getSingleUser = async (id: string) => {
  const user = await User.findById(id).select("-password");
  return {
    data: user,
  };
};

const getMe = async (userId: string) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

export const UserServices = {
  getAllUsers,
  updateUser,
  getSingleUser,
  getMe,
};
