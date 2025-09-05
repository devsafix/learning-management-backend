import express from "express";
import { checkAuth } from "../../middlewares/checkAuth";
import { checkRole } from "../../middlewares/checkRole";
import { userRoles } from "../user/user.constant";
import { CategoryController } from "./category.controller";

const router = express.Router();

router.post(
  "/",
  checkAuth,
  checkRole(userRoles.ADMIN),
  CategoryController.create
);
router.get("/", CategoryController.getAll);
router.patch(
  "/:id",
  checkAuth,
  checkRole(userRoles.ADMIN),
  CategoryController.update
);
router.delete(
  "/:id",
  checkAuth,
  checkRole(userRoles.ADMIN),
  CategoryController.remove
);

export const CategoryRoutes = router;
