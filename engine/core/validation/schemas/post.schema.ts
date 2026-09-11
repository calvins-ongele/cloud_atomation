// engine/core/validation/schemas/post.schema.ts
import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(5),
}); 
 