import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { OtpRoutes } from "../modules/otp/otp.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { CourseRoutes } from "../modules/course/course.route";
import { LessonRoutes } from "../modules/lesson/lesson.route";
import { PaymentRoutes } from "../modules/payment/payment.route";
import { OrderRoutes } from "../modules/order/order.route";
import { AdminRoutes } from "../modules/admin/admin.route";

// Initialize Express Router
export const router = Router();

// All module-based routes are collected here
const moduleRoutes = [
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/otp",
    route: OtpRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/course",
    route: CourseRoutes,
  },
  {
    path: "/lessons",
    route: LessonRoutes,
  },
  {
    path: "/orders",
    route: OrderRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
];

// Dynamically register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
