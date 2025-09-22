import { z } from "zod";

export const createCourseZod = z.object({
  title: z.string().min(3),
  description: z.string().min(20),
  price: z.number().nonnegative(),
  discount: z.number().min(0).max(100).optional(),
  level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  categoryId: z.string(),
  thumbnail: z.string().url(),
});

export const updateCourseZod = createCourseZod.partial();
