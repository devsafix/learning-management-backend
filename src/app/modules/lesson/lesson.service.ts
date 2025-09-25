import { Lesson } from "./lesson.model";
import { ILesson } from "./lesson.interface";
import { Course } from "../course/course.model";
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";

const create = async (payload: ILesson) => {
  // Validate that the course exists
  const course = await Course.findById(payload.courseId);
  if (!course) {
    throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
  }

  // Check if order is already taken for this course
  const existingLesson = await Lesson.findOne({
    courseId: payload.courseId,
    order: payload.order,
  });

  if (existingLesson) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      "Lesson order already exists for this course"
    );
  }

  // Create the lesson
  const lesson = await Lesson.create(payload);

  // Update course total lessons count
  await Course.findByIdAndUpdate(payload.courseId, {
    $inc: { totalLessons: 1 },
  });

  return lesson;
};

const list = async () => {
  return await Lesson.find({})
    .populate("courseId", "title slug")
    .sort({ createdAt: -1 });
};

const byCourse = async (courseId: string) => {
  // Validate that the course exists
  const course = await Course.findById(courseId);
  if (!course) {
    throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
  }

  return await Lesson.find({ courseId })
    .populate("courseId", "title slug")
    .sort({ order: 1 });
};

const update = async (id: string, payload: Partial<ILesson>) => {
  const existingLesson = await Lesson.findById(id);
  if (!existingLesson) {
    throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
  }

  // If updating order, check if it conflicts with existing lessons in the same course
  if (payload.order && payload.order !== existingLesson.order) {
    const conflictingLesson = await Lesson.findOne({
      courseId: existingLesson.courseId,
      order: payload.order,
      _id: { $ne: id }, // Exclude current lesson
    });

    if (conflictingLesson) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Lesson order already exists for this course"
      );
    }
  }

  // If changing course, validate new course exists
  if (
    payload.courseId &&
    payload.courseId !== existingLesson.courseId.toString()
  ) {
    const newCourse = await Course.findById(payload.courseId);
    if (!newCourse) {
      throw new AppError(StatusCodes.NOT_FOUND, "New course not found");
    }

    // Update lesson counts for both courses
    await Course.findByIdAndUpdate(existingLesson.courseId, {
      $inc: { totalLessons: -1 },
    });
    await Course.findByIdAndUpdate(payload.courseId, {
      $inc: { totalLessons: 1 },
    });
  }

  return await Lesson.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("courseId", "title slug");
};

const remove = async (id: string) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) {
    throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
  }

  // Delete the lesson
  await Lesson.findByIdAndDelete(id);

  // Update course total lessons count
  await Course.findByIdAndUpdate(lesson.courseId, {
    $inc: { totalLessons: -1 },
  });

  return lesson;
};

const detail = async (id: string) => {
  const lesson = await Lesson.findById(id).populate("courseId", "title slug");

  if (!lesson) {
    throw new AppError(StatusCodes.NOT_FOUND, "Lesson not found");
  }

  return lesson;
};

export const LessonService = {
  create,
  list,
  byCourse,
  update,
  remove,
  detail,
};
