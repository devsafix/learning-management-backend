import { Types } from "mongoose";
import { IUser } from "../user/user.interface";

export interface IOrder {
  course: Types.ObjectId;
  student: Types.ObjectId;
  status: "PENDING" | "ENROLLED" | "CANCELLED";
  createdAt?: Date | undefined;
  updatedAt?: Date | undefined;
  user: IUser
}
