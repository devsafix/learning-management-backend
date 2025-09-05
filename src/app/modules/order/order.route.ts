import express from "express";
import { OrderController } from "./order.controller";
import { checkAuth } from "../../middlewares/checkAuth";

export const OrderRoutes = express.Router();

OrderRoutes.post("/enroll/:courseId", checkAuth, OrderController.enrollCourse);
OrderRoutes.get("/my-courses", checkAuth, OrderController.getMyCourses);
