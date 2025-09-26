import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { checkRole } from "../../middlewares/checkRole";
import { userRoles } from "../user/user.constant";
import { validateRequest } from "../../middlewares/validateRequest";
import { createLessonZod } from "./lesson.validation";
import { LessonController } from "./lesson.controller";

const router = express.Router();

router.get("/", checkAuth, checkRole(userRoles.ADMIN), LessonController.list);

router.post(
  "/",
  checkAuth,
  checkRole(userRoles.ADMIN),
  validateRequest(createLessonZod),
  LessonController.create
);
router.get("/by-course/:courseId", LessonController.byCourse);
router.get("/:id", LessonController.detail);
router.patch(
  "/:id",
  checkAuth,
  checkRole(userRoles.ADMIN),
  LessonController.update
);
router.delete(
  "/:id",
  checkAuth,
  checkRole(userRoles.ADMIN),
  LessonController.remove
);

export const LessonRoutes = router;
