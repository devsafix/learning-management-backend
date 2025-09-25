/* eslint-disable @typescript-eslint/no-unused-vars */
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { LessonService } from "./lesson.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const create = catchAsync(async (req: Request, res: Response) => {
  console.log("Create lesson request body:", req.body);

  // Check if request body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Request body is empty or missing",
      data: null,
    });
  }

  // Handle form-data case (if data comes as stringified JSON)
  let lessonData = req.body;
  if (req.body?.data && typeof req.body.data === "string") {
    try {
      lessonData = JSON.parse(req.body.data);
    } catch (error) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "Invalid JSON format in data field",
        data: null,
      });
    }
  }

  // Validate required fields
  const requiredFields = ["courseId", "title", "videoUrl"];
  const missingFields = requiredFields.filter((field) => !lessonData[field]);

  if (missingFields.length > 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
      data: null,
    });
  }

  // Ensure numeric fields are properly converted
  lessonData.duration = Number(lessonData.duration || 0);
  lessonData.order = Number(lessonData.order || 1);

  // Ensure resources is an array
  if (lessonData.resources && !Array.isArray(lessonData.resources)) {
    lessonData.resources = [lessonData.resources];
  }

  console.log("Processed lesson data:", lessonData);

  const lesson = await LessonService.create(lessonData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.CREATED,
    message: "Lesson created successfully",
    data: lesson,
  });
});

const list = catchAsync(async (req: Request, res: Response) => {
  console.log("Get all lessons request");

  const lessons = await LessonService.list();

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "All lessons retrieved successfully",
    data: lessons,
  });
});

const byCourse = catchAsync(async (req: Request, res: Response) => {
  const { courseId } = req.params;
  console.log("Get lessons by course ID:", courseId);

  if (!courseId) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Course ID is required",
      data: null,
    });
  }

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
  console.log("Update lesson request:", { id, body: req.body });

  if (!id) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Lesson ID is required",
      data: null,
    });
  }

  // Handle form-data case
  let lessonData = req.body;
  if (req.body?.data && typeof req.body.data === "string") {
    try {
      lessonData = JSON.parse(req.body.data);
    } catch (error) {
      return sendResponse(res, {
        statusCode: StatusCodes.BAD_REQUEST,
        success: false,
        message: "Invalid JSON format in data field",
        data: null,
      });
    }
  }

  // Ensure numeric fields are properly converted
  if (lessonData.duration !== undefined) {
    lessonData.duration = Number(lessonData.duration);
  }
  if (lessonData.order !== undefined) {
    lessonData.order = Number(lessonData.order);
  }

  // Ensure resources is an array if provided
  if (lessonData.resources && !Array.isArray(lessonData.resources)) {
    lessonData.resources = [lessonData.resources];
  }

  console.log("Processed update data:", lessonData);

  const updated = await LessonService.update(id, lessonData);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Lesson updated successfully",
    data: updated,
  });
});

const remove = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Delete lesson request:", id);

  if (!id) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Lesson ID is required",
      data: null,
    });
  }

  await LessonService.remove(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Lesson deleted successfully",
    data: null,
  });
});

const detail = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Get lesson detail request:", id);

  if (!id) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Lesson ID is required",
      data: null,
    });
  }

  const lesson = await LessonService.detail(id);

  sendResponse(res, {
    success: true,
    statusCode: StatusCodes.OK,
    message: "Lesson details retrieved successfully",
    data: lesson,
  });
});

export const LessonController = {
  create,
  list,
  byCourse,
  update,
  remove,
  detail,
};
