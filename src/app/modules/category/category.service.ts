import { Category } from "./category.model";
import { ICategory } from "./category.interface";
import slugify from "slugify";

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
  return await Category.findByIdAndDelete(id);
};

export const CategoryService = {
  create,
  getAll,
  update,
  remove,
};
