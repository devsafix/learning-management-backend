import { Schema, model, Types } from "mongoose";
import { ICourse } from "./course.interface";

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, index: "text" },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    categoryId: {
      type: Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },
    instructorId: { type: Types.ObjectId, ref: "User", required: true },
    thumbnail: { type: String },
    totalLessons: { type: Number, default: 0 },
    enrolledCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

courseSchema.index({ title: "text", description: "text" });

export const Course = model<ICourse>("Course", courseSchema);
