/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const getUsers = async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
};

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    const verifiedToken = req.user;

    const payload = req.body;

    const user = await UserServices.updateUser(
      userId,
      payload,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User Updated Successfully",
      data: user,
    });
  }
);

const block = async (req: Request, res: Response) => {
  const result = await UserServices.blockUser(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User blocked successfully",
    data: result,
  });
};

const unblock = async (req: Request, res: Response) => {
  const result = await UserServices.unblockUser(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User unblocked successfully",
    data: result,
  });
};

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "User Retrieved Successfully",
      data: result.data,
    });
  }
);

const getMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload;
    const result = await UserServices.getMe(decodedToken.userId);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.CREATED,
      message: "Your profile Retrieved Successfully",
      data: result.data,
    });
  }
);

export const UserControllers = {
  getUsers,
  updateUser,
  block,
  unblock,
  getSingleUser,
  getMe,
};
