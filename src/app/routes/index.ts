import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/user/user.route";
import { OtpRoutes } from "../modules/otp/otp.route";

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
];

// Dynamically register all routes
moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
