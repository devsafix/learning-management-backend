import { Types } from "mongoose";

export interface IOrder {
  course: Types.ObjectId;
  student: Types.ObjectId;
  status: "PENDING" | "ENROLLED" | "CANCELLED";
}
