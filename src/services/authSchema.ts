import { z } from "zod";

export const registerSchema = {
  password: z
    .string()
    .min(8, { message: "Must be at least 8 characters long" })
    .refine((password) => /[a-z]/.test(password), {
      message: "Must contain at least one lowercase letter",
    })
    .refine((password) => /[A-Z]/.test(password), {
      message: "Must contain at least one uppercase letter",
    })
    .refine((password) => /[0-9]/.test(password), {
      message: "Must contain at least one number",
    })
    .refine((password) => /[^a-zA-Z0-9]/.test(password), {
      message: "Must contain at least one special character",
    }),
  email: z
    .string()
    .min(1, { message: "Email must given" })
    .email({ message: "Invalid email" }),
  name: z.string().min(1, { message: "Name must given" }),
  passwordConfirmation: z
    .string()
    .min(1, { message: "Please enter your password again" }),
  image: z.array(z.instanceof(File)).optional(),
};

export const registerUserSchema = z
  .object({
    email: z.string().email({ message: "Invalid email" }),
    name: z.string().min(1, { message: "Name must given" }),
    password: registerSchema.password,
    profile_avatar: z.array(z.instanceof(File)).optional(),
    passwordConfirmation: z
      .string()
      .min(1, { message: "Please enter your password again" }),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "The two password are not match",
    path: ["passwordConfirmation"],
  });

export const updateUserSchema = z
  .object({
    newEmail: z
      .string()
      .email({ message: "Invalid email" })
      .optional()
      .or(z.literal("")),
    newName: z
      .string()
      .min(1, { message: "Name must given" })
      .optional()
      .or(z.literal("")),
    newPassword: registerSchema.password.optional().or(z.literal("")),
    newProfile_avatar: z.array(z.instanceof(File)).optional(),
    newPasswordConfirmation: z
      .string()
      .min(1, { message: "Please enter your password again" })
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) =>
      !data.newPassword || data.newPassword === data.newPasswordConfirmation,
    {
      message: "The two password are not match",
      path: ["newPasswordConfirmation"],
    }
  );

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter email" })
    .email({ message: "Invalid email format" }),
  password: z.string().min(1, { message: "Please enter password" }),
});

export type RegisterUser = z.infer<typeof registerUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
