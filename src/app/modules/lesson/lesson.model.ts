import { Schema, model, Types } from "mongoose";
import { ILesson } from "./lesson.interface";

const lessonSchema = new Schema<ILesson>(
  {
    courseId: {
      type: Types.ObjectId,
      ref: "Course",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: Number, default: 0 },
    isPreview: { type: Boolean, default: false },
    resources: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true, versionKey: false }
);

lessonSchema.index({ courseId: 1, order: 1 });

export const Lesson = model<ILesson>("Lesson", lessonSchema);
