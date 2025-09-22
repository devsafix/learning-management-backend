import { Types } from "mongoose";
import { ICategory } from "../category/category.interface";
import { IUser } from "../user/user.interface";

export interface ICourse {
  _id?: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  level: "beginner" | "intermediate" | "advanced";
  categoryId: Types.ObjectId | ICategory;
  instructorId: Types.ObjectId | IUser;
  thumbnail: string;
  totalLessons: number;
  enrolledCount: number;
  averageRating: number;
  createdAt?: Date;
  updatedAt?: Date;
}
