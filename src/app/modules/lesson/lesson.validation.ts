import { z } from "zod";

export const createLessonZod = z.object({
  courseId: z.string(),
  title: z.string().min(3),
  videoUrl: z.string().url(),
  duration: z.number().nonnegative().optional(),
  isPreview: z.boolean().optional(),
  resources: z.array(z.string().url()).optional(),
  order: z.number().int().nonnegative().optional(),
});
