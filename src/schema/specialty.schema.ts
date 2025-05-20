import { z } from "zod";

export const specialistSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .refine((value) => value.trim() !== "", {
      message: "Title cannot be empty",
    })
});
