import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OrderServices } from "./order.service";
import { Order } from "./order.model";

const enrollCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.body.student || req.user?.userId;

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

  const orders = await Order.find({ student: studentId, status: "ENROLLED" })
    .populate("course", "title price description")
    .populate("student", "name email");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Enrolled courses retrieved",
    data: orders,
  });
});

export const OrderController = {
  enrollCourse,
  getMyCourses,
};
