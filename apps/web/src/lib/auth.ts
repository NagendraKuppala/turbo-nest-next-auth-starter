"use server";

import { SignInFormData, SignUpFormData, AuthResponse } from "./authTypes";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signIn(data: SignInFormData): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/signin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401) {
      throw new Error("Invalid email or password");
    }
    throw new Error(errorData.message || "Sign in failed");
  }

  return response.json();
}

export async function signUp(data: SignUpFormData): Promise<AuthResponse> {
  const response = await fetch(`${BACKEND_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 409) {
      throw new Error("A user with this email or username already exists");
    }
    throw new Error(errorData.message || "Registration failed");
  }

  return response.json();
}


export const refreshToken = async (oldRefreshToken: string) => {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const response = await fetch(`${backendUrl}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${oldRefreshToken}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to refresh tokens: " + response.statusText);
    }

    const { accessToken, refreshToken } = await response.json();

    // Update the tokens in the session
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL;
    const updateResult = await fetch(`${frontendUrl}/api/auth/updateToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        accessToken,
        refreshToken,
      }),
    });

    if (!updateResult.ok) {
      throw new Error("Failed to update tokens: " + updateResult.statusText);
    }

    return accessToken;
  } catch (error) {
    throw new Error("Failed to refresh tokens: " + error);
  }
};
