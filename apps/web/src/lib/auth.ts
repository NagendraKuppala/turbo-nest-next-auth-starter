import {
  SignInFormData,
  AuthResponse,
  SignUpFormData,
  VerifyEmailResponse,
  ResendVerificationResponse,
  ResetPasswordResponse,
  ForgotPasswordResponse,
  ProfileUpdateResponse,
  PasswordUpdateResponse,
  ProfileUpdateData,
  PasswordUpdateData,
} from "./authTypes";
import { deleteSession, updateTokens, updateSession } from "./session";
import { ApiError } from "./error";
import { config } from "@/config";
import { authFetch } from "./authFetch";

export async function signIn(
  credentials: SignInFormData
): Promise<AuthResponse> {
  try {
    const response = await fetch(`${config.api.url}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || "Login failed",
        response.status,
        errorData.errors
      );
    }

    const result = await response.json();
    console.log("SignIn response:", result);

    return result;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to sign in. Please try again.");
  }
}

export async function signUp(data: SignUpFormData): Promise<AuthResponse> {
  try {
    const response = await fetch(`${config.api.url}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName || "",
        username: data.username || "",
        email: data.email,
        password: data.password,
        termsAccepted: data.termsAccepted, // Add this field
        newsletterOptIn: data.newsletterOptIn || false, // Add this field
        recaptchaToken: data.recaptchaToken, // Add this field
      }),
    });

    // Handle response...
    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || "Registration failed",
        response.status,
        errorData.errors
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to sign up. Please try again.");
  }
}

export async function verifyEmail(token: string): Promise<VerifyEmailResponse> {
  try {
    const response = await fetch(
      `${config.api.url}/auth/verify-email?token=${token}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || "Email verification failed",
        response.status,
        errorData.errors
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to verify email. Please try again.");
  }
}

export async function resendVerification(
  email: string
): Promise<ResendVerificationResponse> {
  try {
    const response = await fetch(`${config.api.url}/auth/resend-verification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || "Failed to resend verification email",
        response.status,
        errorData.errors
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to resend verification email. Please try again.");
  }
}

export async function refreshToken(oldRefreshToken: string) {
  try {
    const response = await fetch(`${config.api.url}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${oldRefreshToken}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      // If refresh fails, clear the session and redirect to login
      await deleteSession();
      throw new Error("Token refresh failed");
    }

    const { accessToken, refreshToken } = await response.json();

    // Update tokens in session
    await updateTokens({ accessToken, refreshToken });

    return { accessToken, refreshToken };
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Clear session on error
    await deleteSession();
    throw error;
  }
}

export async function forgotPassword(
  email: string
): Promise<ForgotPasswordResponse> {
  try {
    const response = await fetch(`${config.api.url}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || "Failed to send password reset email",
        response.status,
        errorData.errors
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to send password reset email. Please try again.");
  }
}

export async function resetPassword(
  token: string,
  password: string
): Promise<ResetPasswordResponse> {
  try {
    const response = await fetch(`${config.api.url}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.message || "Failed to reset password",
        response.status,
        errorData.errors
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to reset password. Please try again.");
  }
}

export async function updateProfile(data: ProfileUpdateData): Promise<ProfileUpdateResponse> {
  try {
    const response = await authFetch(`${config.api.url}/auth/updateProfile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    await updateSession(response);
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to update profile. Please try again.");
  }
}


export async function updatePassword(data: PasswordUpdateData): Promise<PasswordUpdateResponse> {
  try {
    const response = await authFetch(`${config.api.url}/auth/updatePassword`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to change password. Please try again.");
  }
}


export async function updateAvatar(file: File) {
  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await authFetch(`${config.api.url}/users/avatar`, {
      method: "POST",
      body: formData,
    });
    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error("Failed to update avatar. Please try again.");
  }
}
