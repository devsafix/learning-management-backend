import express from "express";
import { OrderController } from "./order.controller";
import { checkAuth } from "../../middlewares/checkAuth";

export const OrderRoutes = express.Router();

OrderRoutes.get("/my-courses", checkAuth, OrderController.getMyCourses);
OrderRoutes.post("/enroll/:courseId", checkAuth, OrderController.enrollCourse);
OrderRoutes.get(
  "/enrollment-status/:courseId",
  checkAuth,
  OrderController.getEnrollmentStatus
);
