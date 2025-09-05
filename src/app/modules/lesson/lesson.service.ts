import { Lesson } from "./lesson.model";
import { ILesson } from "./lesson.interface";

const create = async (payload: ILesson) => {
  return await Lesson.create(payload);
};

const byCourse = async (courseId: string) => {
  return await Lesson.find({ courseId }).sort({ order: 1 });
};

const update = async (id: string, payload: Partial<ILesson>) => {
  return await Lesson.findByIdAndUpdate(id, payload, { new: true });
};

const remove = async (id: string) => {
  return await Lesson.findByIdAndDelete(id);
};

export const LessonService = {
  create,
  byCourse,
  update,
  remove,
};
