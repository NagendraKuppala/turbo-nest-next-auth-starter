"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createSession } from "@/lib/session";
import { SignInForm } from "./SignInForm";
import { AuthResponse} from "@/lib/authTypes";
import { useAuthStore } from "@/store/authStore";

export default function SignInPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSuccess = async (result: AuthResponse) => {
    try {
      console.log("Creating session with result:", result);
      // First update the session
      await createSession({
        user: {
          id: result.id,
          email: result.email,
          username: result.username,
          role: result.role,
          avatar: result.avatar,
        },
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      });
      
      useAuthStore.setState({ 
        isAuthenticated: true,
        user: {
          id: result.id,
          email: result.email,
          username: result.username,
          role: result.role,
          avatar: result.avatar
        },
        isLoading: false
      });

      router.push("/");
    } catch (error) {
      console.error("Error during sign-in:", error);
      setErrorMessage(error instanceof Error ? error.message : "Failed to sign in");
    }
  };

  const handleError = (error: Error) => {
    setErrorMessage(error.message);
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex flex-row gap-1 justify-center text-xl">
              <p>Welcome to</p>
              <Link href="/" className="underline underline-offset-4">
                KwikDeals
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SignInForm
              onSuccess={handleSuccess}
              onError={handleError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              errorMessage={errorMessage}
            />
          </CardContent>
        </Card>
        <div className="text-center text-sm text-muted-foreground">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary underline">
            Privacy Policy
          </Link>
          .
        </div>
      </div>
    </div>
  );
}
