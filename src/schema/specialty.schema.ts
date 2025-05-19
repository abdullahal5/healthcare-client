import { z } from "zod";

export const specialistSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Title is required" })
    .refine((value) => value.trim() !== "", {
      message: "Title cannot be empty",
    }),
  file: z
    .custom<FileList>()
    .refine((files) => files?.length > 0, { message: "File is required" })
    .refine((files) => files?.[0]?.size <= 5 * 1024 * 1024, {
      message: "File size must be less than 5MB",
    }),
});
