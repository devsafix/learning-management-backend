/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { StatusCodes } from "http-status-codes";
import { CourseService } from "./course.service";

const create = catchAsync(async (req, res) => {
  // Check if request body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: "Request body is empty or missing",
      data: null,
    });
  }

  let courseData = req.body;

  // Handle form-data case (if data comes as stringified JSON)
  if (req.body?.data && typeof req.body.data === "string") {
    try {
      courseData = JSON.parse(req.body.data);
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
  const requiredFields = [
    "title",
    "description",
    "price",
    "categoryId",
    "thumbnail",
  ];
  const missingFields = requiredFields.filter((field) => !courseData[field]);

  if (missingFields.length > 0) {
    return sendResponse(res, {
      statusCode: StatusCodes.BAD_REQUEST,
      success: false,
      message: `Missing required fields: ${missingFields.join(", ")}`,
      data: null,
    });
  }

  // Ensure numeric fields are properly converted
  courseData.price = Number(courseData.price);
  courseData.discount = Number(courseData.discount || 0);
  courseData.totalLessons = Number(courseData.totalLessons || 0);

  const data = await CourseService.create(courseData, req.user.userId);

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Course created successfully",
    data,
  });
});

const update = catchAsync(async (req, res) => {
  // Handle both multipart form data and regular JSON
  let courseData = req.body;

  if (req.body?.data && typeof req.body.data === "string") {
    try {
      courseData = JSON.parse(req.body.data);
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
  if (courseData.price !== undefined)
    courseData.price = Number(courseData.price);
  if (courseData.discount !== undefined)
    courseData.discount = Number(courseData.discount);
  if (courseData.totalLessons !== undefined)
    courseData.totalLessons = Number(courseData.totalLessons);

  const data = await CourseService.update(req.params.id, courseData);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course updated successfully",
    data,
  });
});

const remove = catchAsync(async (req, res) => {
  await CourseService.remove(req.params.id);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course deleted successfully",
    data: null,
  });
});

const list = catchAsync(async (req, res) => {
  const data = await CourseService.list(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Courses retrieved successfully",
    data: data.items,
    meta: data.meta,
  });
});

const detail = catchAsync(async (req, res) => {
  const data = await CourseService.detail(req.params.slug);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "Course details retrieved successfully",
    data,
  });
});

export const CourseController = { create, update, remove, list, detail };
