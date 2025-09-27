/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { Course } from "../course/course.model";
import { User } from "../user/user.model";
import { Lesson } from "../lesson/lesson.model";
import { Order } from "../order/order.model";
import { StatusCodes } from "http-status-codes";

/**
 * Get comprehensive dashboard statistics
 */
const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  // Get all data in parallel
  const [users, courses, lessons, orders] = await Promise.all([
    User.find().select("-password"),
    Course.find().populate("categoryId", "name"),
    Lesson.find(),
    Order.find().populate("course", "title price"),
  ]);

  // Calculate basic stats
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalLessons = lessons.length;
  const activeUsers = users.filter((user) => !user.isBlocked).length;
  const blockedUsers = users.filter((user) => user.isBlocked).length;
  const verifiedUsers = users.filter((user) => user.isVerified).length;

  // Calculate revenue
  const enrolledOrders = orders.filter((order) => order.status === "ENROLLED");
  const totalRevenue = enrolledOrders.reduce((acc, order) => {
    return acc + ((order.course as any)?.price || 0);
  }, 0);

  // Monthly revenue calculation (last 6 months)
  const monthlyRevenue = [];
  const currentDate = new Date();

  for (let i = 5; i >= 0; i--) {
    const month = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      1
    );

    const monthOrders = enrolledOrders.filter((order) => {
      const orderDate = new Date(order.createdAt ?? 0);
      return orderDate >= month && orderDate < nextMonth;
    });

    const monthRevenue = monthOrders.reduce((acc, order) => {
      return acc + ((order.course as any)?.price || 0);
    }, 0);

    monthlyRevenue.push({
      month: month.toLocaleDateString("en-US", { month: "short" }),
      revenue: monthRevenue,
      enrollments: monthOrders.length,
    });
  }

  // Courses by category
  const coursesByCategory: Record<string, number> = {};
  courses.forEach((course) => {
    if (
      course.categoryId &&
      typeof course.categoryId === "object" &&
      "name" in course.categoryId
    ) {
      const categoryName = (course.categoryId as any).name;
      coursesByCategory[categoryName] =
        (coursesByCategory[categoryName] || 0) + 1;
    }
  });

  const categoryData = Object.entries(coursesByCategory).map(
    ([category, count]) => ({
      category,
      count,
    })
  );

  // Recent enrollments
  const recentEnrollments = enrolledOrders
    .sort(
      (a, b) =>
        new Date(b.createdAt ?? 0).getTime() -
        new Date(a.createdAt ?? 0).getTime()
    )
    .slice(0, 10)
    .map((order) => ({
      _id: order._id,
      user: (order.user as any)?.name || "Unknown",
      course: (order.course as any)?.title || "Unknown",
      createdAt: order.createdAt,
      amount: (order.course as any)?.price || 0,
    }));

  const dashboardData = {
    totalUsers,
    totalCourses,
    totalLessons,
    totalCategories: categoryData.length,
    activeUsers,
    blockedUsers,
    verifiedUsers,
    totalRevenue,
    monthlyRevenue,
    coursesByCategory: categoryData,
    recentEnrollments,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Dashboard statistics retrieved successfully",
    data: dashboardData,
  });
});

/**
 * Get total earnings for all courses
 */
const getEarnings = catchAsync(async (req: Request, res: Response) => {
  // For admin, get all courses earnings (not filtered by instructor)
  const orders = await Order.find({
    status: "ENROLLED",
  }).populate("course", "price title");

  const totalRevenue = orders.reduce(
    (acc, order) => acc + ((order.course as any)?.price || 0),
    0
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Earnings retrieved successfully",
    data: { totalRevenue, orders },
  });
});

/**
 * Get top 5 courses by student enrollment
 */
const getTopCourses = catchAsync(async (req: Request, res: Response) => {
  // Get all courses and sort by enrollment count
  const topCourses = await Course.find()
    .populate("categoryId", "name")
    .sort({ enrolledCount: -1 })
    .limit(10)
    .select("title enrolledCount averageRating price categoryId");

  // Also get data from orders for more accurate top courses
  const orderStats = await Order.aggregate([
    {
      $match: {
        status: "ENROLLED",
      },
    },
    {
      $group: {
        _id: "$course",
        studentCount: { $sum: 1 },
        totalRevenue: { $sum: "$amount" },
      },
    },
    {
      $sort: { studentCount: -1 },
    },
    {
      $limit: 10,
    },
    {
      $lookup: {
        from: "courses",
        localField: "_id",
        foreignField: "_id",
        as: "courseInfo",
      },
    },
    {
      $unwind: "$courseInfo",
    },
    {
      $project: {
        _id: 1,
        studentCount: 1,
        totalRevenue: 1,
        title: "$courseInfo.title",
        price: "$courseInfo.price",
        averageRating: "$courseInfo.averageRating",
      },
    },
  ]);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Top courses retrieved successfully",
    data: orderStats.length > 0 ? orderStats : topCourses,
  });
});

/**
 * Get user analytics
 */
const getUserAnalytics = catchAsync(async (req: Request, res: Response) => {
  const users = await User.find().select("-password");

  // User registration trend (last 12 months)
  const userRegistrationTrend = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const month = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      1
    );

    const monthUsers = users.filter((user) => {
      const userDate = new Date(user.createdAt ?? 0);
      return userDate >= month && userDate < nextMonth;
    });

    userRegistrationTrend.push({
      month: month.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      users: monthUsers.length,
      active: monthUsers.filter((u) => !u.isBlocked).length,
      verified: monthUsers.filter((u) => u.isVerified).length,
    });
  }

  // User demographics
  const userStats = {
    total: users.length,
    active: users.filter((u) => !u.isBlocked).length,
    blocked: users.filter((u) => u.isBlocked).length,
    verified: users.filter((u) => u.isVerified).length,
    admins: users.filter((u) => u.role === "admin").length,
    registrationTrend: userRegistrationTrend,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User analytics retrieved successfully",
    data: userStats,
  });
});

/**
 * Get course analytics
 */
const getCourseAnalytics = catchAsync(async (req: Request, res: Response) => {
  const courses = await Course.find().populate("categoryId", "name");
  const lessons = await Lesson.find();

  // Course creation trend (last 12 months)
  const courseCreationTrend = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const month = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      1
    );

    const monthCourses = courses.filter((course) => {
      const courseDate = new Date(course.createdAt ?? 0);
      return courseDate >= month && courseDate < nextMonth;
    });

    courseCreationTrend.push({
      month: month.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      courses: monthCourses.length,
      lessons: lessons.filter((lesson) =>
        monthCourses.some(
          (course) => course._id.toString() === lesson.courseId.toString()
        )
      ).length,
    });
  }

  // Course statistics
  const courseStats = {
    total: courses.length,
    byLevel: {
      beginner: courses.filter((c) => c.level === "beginner").length,
      intermediate: courses.filter((c) => c.level === "intermediate").length,
      advanced: courses.filter((c) => c.level === "advanced").length,
    },
    totalLessons: lessons.length,
    averageLessonsPerCourse: lessons.length / courses.length || 0,
    creationTrend: courseCreationTrend,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course analytics retrieved successfully",
    data: courseStats,
  });
});

/**
 * Get revenue analytics with detailed breakdown
 */
const getRevenueAnalytics = catchAsync(async (req: Request, res: Response) => {
  const orders = await Order.find({ status: "ENROLLED" })
    .populate("course", "title price categoryId")
    .populate("user", "name email");

  // Total revenue
  const totalRevenue = orders.reduce(
    (acc, order) => acc + ((order.course as any)?.price || 0),
    0
  );

  // Revenue by month (last 12 months)
  const monthlyRevenue = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const month = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i,
      1
    );
    const nextMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() - i + 1,
      1
    );

    const monthOrders = orders.filter((order) => {
      const orderDate = new Date(order.createdAt ?? 0);
      return orderDate >= month && orderDate < nextMonth;
    });

    const monthRevenue = monthOrders.reduce(
      (acc, order) => acc + ((order.course as any)?.price || 0),
      0
    );

    monthlyRevenue.push({
      month: month.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      revenue: monthRevenue,
      orders: monthOrders.length,
    });
  }

  // Average order value
  const averageOrderValue =
    orders.length > 0 ? totalRevenue / orders.length : 0;

  const revenueData = {
    totalRevenue,
    totalOrders: orders.length,
    averageOrderValue,
    monthlyRevenue,
  };

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Revenue analytics retrieved successfully",
    data: revenueData,
  });
});

export const AdminController = {
  getDashboardStats,
  getEarnings,
  getTopCourses,
  getUserAnalytics,
  getCourseAnalytics,
  getRevenueAnalytics,
};
