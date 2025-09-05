import { Lesson } from "./lesson.model";
import { ILesson } from "./lesson.interface";
import { Course } from "../course/course.model";

const create = async (payload: ILesson) => {
  const lesson = await Lesson.create(payload);

  await Course.findByIdAndUpdate(payload.courseId, {
    $inc: { totalLessons: 1 },
  });

  return lesson;
};

const byCourse = async (courseId: string) => {
  return await Lesson.find({ courseId }).sort({ order: 1 });
};

const update = async (id: string, payload: Partial<ILesson>) => {
  return await Lesson.findByIdAndUpdate(id, payload, { new: true });
};

const remove = async (id: string) => {
  const lesson = await Lesson.findById(id);
  if (!lesson) return null;

  await Lesson.findByIdAndDelete(id);

  await Course.findByIdAndUpdate(lesson.courseId, {
    $inc: { totalLessons: -1 },
  });

  return lesson;
};

export const LessonService = {
  create,
  byCourse,
  update,
  remove,
};
