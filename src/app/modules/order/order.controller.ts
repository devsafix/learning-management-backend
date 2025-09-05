import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { OrderServices } from "./order.service";

const enrollCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const userId = req.body.student || req.user?.id;

  const result = await OrderServices.enrollCourse(courseId, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Enrollment initiated, redirect to payment",
    data: result,
  });
});

export const OrderController = {
  enrollCourse,
};
