/* eslint-disable @typescript-eslint/no-unused-vars */
import { BcryptHelper } from "../../utils/bcrypt";
import AppError from "../../errorHelpers/AppError";
import { User } from "../user/user.model";
import { StatusCodes } from "http-status-codes";
import {
  createNewAccessTokenWithRefreshToken,
  createUserTokens,
} from "../../utils/userTokens";
import { sendEmail } from "../../utils/sendEmail";
import { envVariables } from "../../config/env";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcryptjs from "bcryptjs";

const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role: string;
}) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Email already exists");
  }

  const user = new User(payload);
  await user.save();

  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
};

const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user || user.isBlocked) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "User not found or blocked");
  }

  const isPasswordValid = await BcryptHelper.comparePassword(
    password,
    user.password as string
  );
  if (!isPasswordValid)
    throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid password");

  const userTokens = await createUserTokens(user);
  const { password: _, ...rest } = user.toObject();

  return {
    tokens: userTokens,
    user: rest,
  };
};

const forgotPassword = async (email: string) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User does not exist");
  }
  if (!isUserExist.isVerified) {
    throw new AppError(StatusCodes.BAD_REQUEST, "User is not verified");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVariables.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const resetUILink = `${envVariables.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  sendEmail({
    to: isUserExist.email,
    subject: "Password Reset",
    templateName: "forgetPassword",
    templateData: {
      name: isUserExist.name,
      resetUILink,
    },
  });
};

const changePassword = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId).select("+password");
  if (!user) throw new AppError(StatusCodes.NOT_FOUND, "User not found");

  const ok = await BcryptHelper.comparePassword(
    oldPassword,
    user.password as string
  );
  if (!ok)
    throw new AppError(StatusCodes.UNAUTHORIZED, "Old password incorrect");

  user.password = newPassword;
  await user.save();
};

const getNewAccessToken = async (refreshToken: string) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );

  return {
    accessToken: newAccessToken,
  };
};
export const AuthServices = {
  registerUser,
  loginUser,
  forgotPassword,
  changePassword,
  getNewAccessToken,
};
