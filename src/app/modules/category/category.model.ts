import { Schema, model } from "mongoose";
import { ICategory } from "./category.interface";

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, unique: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

export const Category = model<ICategory>("Category", categorySchema);
