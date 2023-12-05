import * as z from "zod";

export const signUpSchema = z.object({
  name: z.string().min(2, { message: "Too short" }),
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email(),
  password: z.string().min(8, { message: "Too short" }),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: "Too short" }),
});

export const postFormSchema = z.object({
  caption: z
    .string()
    .min(5, {
      message: "caption must be at least 5 characters.",
    })
    .max(2200),
  file: z.custom<File[]>(),
  location: z.string().min(2).max(100),
  tags: z.string(),
});
