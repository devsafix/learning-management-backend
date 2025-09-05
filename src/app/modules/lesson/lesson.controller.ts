import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LessonService } from "./lesson.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  const lesson = await LessonService.create(req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Lesson created successfully",
    data: lesson,
  });
});

const byCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  const lessons = await LessonService.byCourse(courseId);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Lessons retrieved successfully",
    data: lessons,
  });
});

const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updated = await LessonService.update(id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Lesson updated successfully",
    data: updated,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  await LessonService.remove(id);
  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Lesson deleted successfully",
    data: null,
  });
});

export const LessonController = {
  create,
  byCourse,
  update,
  remove,
};
