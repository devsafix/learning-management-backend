import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CourseService } from "./course.service";

const create = catchAsync(async (req, res) => {
  const data = await CourseService.create(req.body, req.user.userId);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Course created",
    data,
  });
});

const update = catchAsync(async (req, res) => {
  const data = await CourseService.update(req.params.id, req.body);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course updated",
    data,
  });
});

const remove = catchAsync(async (req, res) => {
  await CourseService.remove(req.params.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course deleted",
    data: null,
  });
});

const list = catchAsync(async (req, res) => {
  const data = await CourseService.list(req.query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Courses retrieved",
    data: data.items,
    meta: data.meta,
  });
});

const detail = catchAsync(async (req, res) => {
  const data = await CourseService.detail(req.params.slug);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course detail",
    data,
  });
});

export const CourseController = { create, update, remove, list, detail };
