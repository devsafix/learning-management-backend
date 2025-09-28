import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OrderServices } from "./order.service";
import { Order } from "./order.model";
import { StatusCodes } from "http-status-codes";

const enrollCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.user?.userId;

  const result = await OrderServices.enrollCourse(courseId, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Enrollment initiated, redirect to payment",
    data: result,
  });
});

const getMyCourses = catchAsync(async (req: Request, res: Response) => {
  const studentId = req.user?.userId;

  if (!studentId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const orders = await Order.find({
    student: studentId,
    status: "ENROLLED",
  })
    .populate(
      "course",
      "title price description thumbnail slug categoryId totalLessons enrolledCount averageRating"
    )
    .populate("student", "name email")
    .sort({ createdAt: -1 });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Enrolled courses retrieved successfully",
    data: orders,
  });
});

const getEnrollmentStatus = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const studentId = req.user?.userId;

  if (!studentId) {
    return sendResponse(res, {
      statusCode: StatusCodes.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
  }

  const enrollment = await Order.findOne({
    student: studentId,
    course: courseId,
    status: "ENROLLED",
  });

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Enrollment status retrieved",
    data: {
      isEnrolled: !!enrollment,
      enrollmentId: enrollment?._id || null,
      enrolledAt: enrollment?.createdAt || null,
    },
  });
});

export const OrderController = {
  enrollCourse,
  getMyCourses,
  getEnrollmentStatus,
};
