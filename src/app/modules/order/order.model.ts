import { Schema, model } from "mongoose";
import { IOrder } from "./order.interface";

const orderSchema = new Schema<IOrder>(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "ENROLLED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: true, versionKey: false }
);

export const Order = model<IOrder>("Order", orderSchema);
