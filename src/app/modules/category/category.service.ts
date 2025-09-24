import { Category } from "./category.model";
import { ICategory } from "./category.interface";
import slugify from "slugify";
import { Course } from "../course/course.model";
import AppError from "../../errorHelpers/AppError";

const create = async (payload: ICategory) => {
  const slug = slugify(payload.name, { lower: true, strict: true });
  return await Category.create({ ...payload, slug });
};

const getAll = async () => {
  return await Category.find().sort({ createdAt: -1 });
};

const update = async (id: string, payload: Partial<ICategory>) => {
  return await Category.findByIdAndUpdate(id, payload, { new: true });
};

const remove = async (id: string) => {
  const hasCourses = await Course.exists({ categoryId: id });
  if (hasCourses) {
    throw new AppError(
      400,
      "Cannot delete category. Courses are linked to this category."
    );
  }
  return await Category.findByIdAndDelete(id);
};

export const CategoryService = {
  create,
  getAll,
  update,
  remove,
};
