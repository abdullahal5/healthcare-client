import { z } from "zod";

export const formSchema = z.object({
  password: z
    .string({ required_error: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters" }),
  patient: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2, { message: "Name must be at least 2 characters" }),
    email: z
      .string({ required_error: "Email is required" })
      .email({ message: "Please enter a valid email address" }),
  }),
});
