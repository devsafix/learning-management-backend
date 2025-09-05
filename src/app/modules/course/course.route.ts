import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { checkRole } from "../../middlewares/checkRole";
import { userRoles } from "../user/user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { createCourseZod, updateCourseZod } from "./course.validation";
import { CourseController } from "./course.controller";

const router = express.Router();

// Public browse
router.get("/", CourseController.list);
router.get("/:slug", CourseController.detail);

// Owner CRUD
router.post(
  "/",
  checkAuth,
  checkRole(userRoles.ADMIN),
  validateRequest(createCourseZod),
  CourseController.create
);
router.patch(
  "/:id",
  checkAuth,
  checkRole(userRoles.ADMIN),
  validateRequest(updateCourseZod),
  CourseController.update
);
router.delete(
  "/:id",
  checkAuth,
  checkRole(userRoles.ADMIN),
  CourseController.remove
);

export const CourseRoutes = router;
