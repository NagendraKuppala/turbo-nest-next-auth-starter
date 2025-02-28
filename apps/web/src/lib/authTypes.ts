import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .toLowerCase(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(100)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one numeric and one special character",
      }
    ),
});

export const signUpSchema = z
  .object({
    firstName: z.string().min(1, { message: "First name is required" }).max(20),
    lastName: z.string().max(20).optional(),
    username: z
      .string()
      .min(1, { message: "Username is required" })
      .max(20)
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      })
      .optional(),
    email: z.string().email({ message: "Enter a valid email address" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/, {
        message:
          "Password must contain at least one uppercase letter, one number, and one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

export type UserRole = "USER" | "ADMIN";

export interface AuthResponse {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  accessToken: string;
  refreshToken: string;
}