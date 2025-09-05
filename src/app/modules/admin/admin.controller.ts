/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Course } from "../course/course.model";
import { Order } from "../order/order.model";

/**
 * Get total earnings for all courses of the instructor
 */
const getEarnings = catchAsync(async (req: Request, res) => {
  const instructorId = req.user?.id;

  const courses = await Course.find({ instructor: instructorId }).select(
    "_id title"
  );
  const courseIds = courses.map((c) => c._id);

  const orders = await Order.find({
    course: { $in: courseIds },
    status: "ENROLLED",
  }).populate("course", "price title");

  const totalRevenue = orders.reduce(
    (acc, o) => acc + (o.course as any).price,
    0
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Instructor earnings retrieved",
    data: { totalRevenue, orders },
  });
});

/**
 * Get top 5 courses by student enrollment
 */
const getTopCourses = catchAsync(async (req: Request, res) => {
  const instructorId = req.user?.id;

  const courses = await Course.find({ instructor: instructorId }).select(
    "_id title"
  );

  const topCourses = await Order.aggregate([
    {
      $match: {
        course: { $in: courses.map((c) => c._id) },
        status: "ENROLLED",
      },
    },
    { $group: { _id: "$course", studentCount: { $sum: 1 } } },
    { $sort: { studentCount: -1 } },
    { $limit: 5 },
  ]);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Top courses retrieved",
    data: topCourses,
  });
});

export const AdminController = {
  getEarnings,
  getTopCourses,
};
