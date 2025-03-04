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
}

type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  initialize: () => Promise<void>;
  login: (credentials: SignInFormData) => Promise<AuthResponse>;
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
      // Debug session data
      console.log(
        "Session during initialize:",
        session
          ? {
              hasUser: !!session.user,
              hasToken: !!session.accessToken,
            }
          : "No session"
      );
      set({
        isAuthenticated: !!session?.user,
        user: session?.user || null,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to initialize auth state:", error);
      set({ isLoading: false, isAuthenticated: false, user: null });
    }
  },

  login: async (credentials) => {
    set({ isLoading: true });
    try {
      // Call your signIn server action directly
      const result = await signIn(credentials);

      // Create session with the returned tokens and user data
      await createSession({
        user: {
          id: result.id,
          email: result.email,
          username: result.username,
          firstName: result.firstName,
          lastName: result.lastName || '',
          role: result.role,
          avatar: result.avatar || '',
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
        },
        isLoading: false,
      });

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
    await deleteSession();
    set({ user: null, isAuthenticated: false });
  },

  updateUser: async (userData) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    }));
  },
}));
