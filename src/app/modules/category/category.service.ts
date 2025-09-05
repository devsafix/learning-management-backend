import { Category } from "./category.model";
import { ICategory } from "./category.interface";

const create = async (payload: ICategory) => {
  return await Category.create(payload);
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
