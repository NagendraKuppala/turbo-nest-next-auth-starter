import { SignInFormData, AuthResponse, SignUpFormData } from "./authTypes";
import { deleteSession, updateTokens } from "./session";
import { ApiError } from "./error";
import { config } from "@/config";

export async function signIn(credentials: SignInFormData): Promise<AuthResponse> {
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
    console.log('SignIn response:', result);

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
        password: data.password
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

export async function refreshToken(oldRefreshToken: string) {
  try {
      const response = await fetch(`${config.api.url}/auth/refresh`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${oldRefreshToken}`
          },
          credentials: 'include',
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
};
