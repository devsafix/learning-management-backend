import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { checkRole } from "../../middlewares/checkRole";
import { userRoles } from "../user/user.constant";
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
  CourseController.create
);
router.patch(
  "/:id",
  checkAuth,
  checkRole(userRoles.ADMIN),
  CourseController.update
);
router.delete(
  "/:id",
  checkAuth,
  checkRole(userRoles.ADMIN),
  CourseController.remove
);

export const CourseRoutes = router;
