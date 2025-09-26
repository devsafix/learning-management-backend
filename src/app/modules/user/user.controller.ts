/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { UserServices } from "./user.service";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";
import { JwtPayload } from "jsonwebtoken";

const getUsers = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getAllUsers();

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;

    if (!userId) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    const verifiedToken = req.user;
    const payload = req.body;

    // Handle form-data case
    let userData = payload;
    if (payload?.data && typeof payload.data === "string") {
      try {
        userData = JSON.parse(payload.data);
      } catch (error) {
        return sendResponse(res, {
          statusCode: StatusCodes.BAD_REQUEST,
          success: false,
          message: "Invalid JSON format in data field",
          data: null,
        });
      }
    }

    const user = await UserServices.updateUser(
      userId,
      userData,
      verifiedToken as JwtPayload
    );

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User updated successfully",
      data: user,
    });
  }
);

const block = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "User ID is required",
      data: null,
    });
  }

  const result = await UserServices.blockUser(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User blocked successfully",
    data: result,
  });
});

const unblock = catchAsync(async (req: Request, res: Response) => {
  const userId = req.params.id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "User ID is required",
      data: null,
    });
  }

  const result = await UserServices.unblockUser(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User unblocked successfully",
    data: result,
  });
});

const getSingleUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!id) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "User ID is required",
        data: null,
      });
    }

    const result = await UserServices.getSingleUser(id);

    sendResponse(res, {
      success: true,
      statusCode: StatusCodes.OK,
      message: "User retrieved successfully",
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
      statusCode: StatusCodes.OK,
      message: "Your profile retrieved successfully",
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
