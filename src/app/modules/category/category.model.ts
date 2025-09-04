import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export const Category = model("Category", categorySchema);
