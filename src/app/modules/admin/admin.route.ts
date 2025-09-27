import express from "express";
import { AdminController } from "./admin.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { checkRole } from "../../middlewares/checkRole";
import { userRoles } from "../user/user.constant";

export const AdminRoutes = express.Router();

// Dashboard statistics
AdminRoutes.get(
  "/dashboard-stats",
  checkAuth,
  checkRole(userRoles.ADMIN),
  AdminController.getDashboardStats
);

// Earnings
AdminRoutes.get(
  "/earnings",
  checkAuth,
  checkRole(userRoles.ADMIN),
  AdminController.getEarnings
);

// Top courses
AdminRoutes.get(
  "/top-courses",
  checkAuth,
  checkRole(userRoles.ADMIN),
  AdminController.getTopCourses
);

// User analytics
AdminRoutes.get(
  "/user-analytics",
  checkAuth,
  checkRole(userRoles.ADMIN),
  AdminController.getUserAnalytics
);

// Course analytics
AdminRoutes.get(
  "/course-analytics",
  checkAuth,
  checkRole(userRoles.ADMIN),
  AdminController.getCourseAnalytics
);
