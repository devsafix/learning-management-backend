import { Category } from "./category.model";
import { ICategory } from "./category.interface";
import slugify from "slugify";
import { Course } from "../course/course.model";
import AppError from "../../errorHelpers/AppError";
import { Lesson } from "../lesson/lesson.model";
import { Order } from "../order/order.model";

const create = async (payload: ICategory) => {
  const slug = slugify(payload.name, { lower: true, strict: true });
  return await Category.create({ ...payload, slug });
};

const getAll = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

const update = async (id: string, payload: Partial<ICategory>) => {
  if (payload.name) {
    payload.slug = slugify(payload.name, { lower: true, strict: true });
  }

  return await Category.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
};

const remove = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) throw new AppError(404, "Category not found");

  // delete all courses under this category
  const courses = await Course.find({ categoryId: id });

  for (const course of courses) {
    await Course.findByIdAndDelete(course._id);
    await Lesson.deleteMany({ courseId: course._id });
    await Order.deleteMany({ course: course._id });
  }

  return await Category.findByIdAndDelete(id);
};

export const CategoryService = {
  create,
  getAll,
  update,
  remove,
};
