import { Types } from "mongoose";
import { ICourse } from "../course/course.interface";

export interface ILesson {
  _id?: Types.ObjectId;
  courseId: Types.ObjectId | ICourse;
  title: string;
  videoUrl: string;
  duration: number;
  resources: string[];
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
