import { create } from "zustand";
import { getSession, deleteSession, createSession } from "@/lib/session";
import { signIn } from "@/lib/auth";
import { ApiError } from "@/lib/error";
import { SignInFormData, UserRole, AuthResponse } from "@/lib/authTypes";

export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName?: string | null;
  role: UserRole;
  avatar?: string | null;
  emailVerified: boolean;
  newsletterOptIn: boolean;
}

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (credentials: SignInFormData | AuthResponse) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const session = await getSession();
      // Only update auth state if we have a valid session
      if (session?.user && session?.accessToken) {
        set({
          isAuthenticated: true,
          user: session.user,
          isLoading: false,
        });
      } else {
        // No valid session, clear auth state
        set({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },

  login: async (data: SignInFormData | AuthResponse) => {
    set({ isLoading: true });
    try {
      // Handle both direct login with credentials and passing AuthResponse
      let result: AuthResponse;

      if ("password" in data) {
        // If it's credentials, call signIn
        result = await signIn(data);
      } else {
        // If it's already an AuthResponse (from registration or SSO)
        result = data;
      }

      // Only create session if we have tokens
      if (result.accessToken && result.refreshToken) {
        // Create session with the returned tokens and user data
        await createSession({
          user: {
            id: result.id,
            email: result.email,
            username: result.username,
            firstName: result.firstName,
            lastName: result.lastName || "",
            role: result.role,
            avatar: result.avatar || "",
            emailVerified: result.emailVerified,
            newsletterOptIn: result.newsletterOptIn,
          },
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        // Update store state
        set({
          isAuthenticated: true,
          user: {
            id: result.id,
            email: result.email,
            username: result.username,
            firstName: result.firstName,
            lastName: result.lastName,
            role: result.role,
            avatar: result.avatar,
            emailVerified: result.emailVerified,
            newsletterOptIn: result.newsletterOptIn,
          },
          isLoading: false,
        });
      } else {
        // Handle registration case where we might not have tokens yet
        set({ isLoading: false });
      }

      return result;
    } catch (error) {
      set({
        isLoading: false,
        isAuthenticated: false,
        user: null,
      });

      if (error instanceof ApiError) {
        if (error.isUnauthorized) {
          console.error("Authentication failed:", error.message);
        } else {
          console.error("API Error:", error.message);
        }
      } else {
        console.error(
          "Login error:",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
      throw error;
    }
  },

  logout: async () => {
    try {
      // Call API logout endpoint
      try {
        await fetch('/api/auth/signout', { method: 'GET' });
      } catch (e) {
        // Fail silently and continue logout process
        console.error("Error calling signout API:", e);
      }
      
      // Always delete the session
      await deleteSession();
      
      // Clear state
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error("Logout error:", error);
      // Force clear state even if there was an error
      set({ user: null, isAuthenticated: false });
    }
  },

  updateUser: async (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
}));
