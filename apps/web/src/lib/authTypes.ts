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
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
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
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine(val => val === true, {
      message: "You must accept the Terms and Privacy Policy"
    }),
    newsletterOptIn: z.boolean().optional(),
    recaptchaToken: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInFormData = z.infer<typeof signInSchema>;
export type SignUpFormData = z.infer<typeof signUpSchema>;

export type UserRole = "USER" | "ADMIN";

// Email verification types
export interface VerifyEmailResponse {
  message: string;
}

export interface ResendVerificationResponse {
  message: string;
}
export interface AuthResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  emailVerified: boolean;
  newsletterOptIn: boolean;
  termsAccepted: boolean;
  accessToken: string;
  refreshToken: string;
  message?: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordResponse {
  message: string;
}

// Add this to the end of the file
export const resetPasswordSchema = z
  .object({
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
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" })
    .toLowerCase(),
});

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Profile schema for updating user profile
export const profileSchema = z.object({
  firstName: z
    .string()
    .max(20)
    .min(2, "First Name must be at least 2 characters"),
  lastName: z.string().max(20).optional(),
  username: z.string().max(20).min(2, "Username must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  newsletterOptIn: z.boolean().optional(),
});

// Password change schema
export const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;

export interface ProfileUpdateData {
  firstName: string;
  lastName?: string;
  username: string;
  newsletterOptIn?: boolean;
}

export interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
}

export interface ProfileUpdateResponse {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName?: string;
  role: UserRole;
  avatar?: string;
  emailVerified: boolean;
}

export interface PasswordUpdateResponse {
  message: string;
}
