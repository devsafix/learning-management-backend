/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import { StatusCodes } from "http-status-codes";
import { Course } from "./course.model";
import slugify from "slugify";

const create = async (payload: any, ownerId: string) => {
  const slug = slugify(payload.title, { lower: true, strict: true });
  const exists = await Course.findOne({ slug });
  if (exists)
    throw new AppError(StatusCodes.BAD_REQUEST, "Course title already in use");

  return Course.create({ ...payload, slug, instructorId: ownerId });
};

const update = async (id: string, payload: any) => {
  if (payload.title)
    payload.slug = slugify(payload.title, { lower: true, strict: true });
  const updated = await Course.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
  return updated;
};

const remove = async (id: string) => {
  const c = await Course.findByIdAndDelete(id);
  if (!c) throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
};

const list = async (q: any) => {
  const {
    search,
    categoryId,
    level,
    minPrice,
    maxPrice,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    limit = 12,
  } = q;

  const filter: any = {};
  if (categoryId) filter.categoryId = categoryId;
  if (level) filter.level = level;
  if (minPrice || maxPrice)
    filter.price = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  if (search) filter.$text = { $search: search };

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Course.find(filter)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(Number(limit)),
    Course.countDocuments(filter),
  ]);

  return {
    items,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
  };
};

const detail = async (slug: string) => {
  const c = await Course.findOne({ slug })
    .populate("categoryId", "name slug")
    .populate("instructorId", "name email");

  if (!c) throw new AppError(StatusCodes.NOT_FOUND, "Course not found");
  return c;
};

export const CourseService = { create, update, remove, list, detail };
