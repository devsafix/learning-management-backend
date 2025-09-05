import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { CategoryService } from "./category.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  const category = await CategoryService.create(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Category created successfully",
    data: category,
  });
});

const getAll = catchAsync(async (req: Request, res: Response) => {
  const categories = await CategoryService.getAll();
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await CategoryService.update(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category updated successfully",
    data: updated,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await CategoryService.remove(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Category deleted successfully",
    data: null,
  });
});

export const CategoryController = {
  create,
  getAll,
  update,
  remove,
};
