"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { createSession } from "@/lib/session";
import { SignInForm } from "./SignInForm";
import { AuthResponse } from "@/lib/authTypes";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [verificationNeeded, setVerificationNeeded] = useState<string | null>(
    null
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSuccess = async (result: AuthResponse) => {
    try {
      // First update the session
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

      useAuthStore.setState({
        isAuthenticated: true,
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
        isLoading: false,
      });

      router.push("/");
    } catch (error) {
      console.error("Error during sign-in:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to sign in"
      );
    }
  };

  const handleError = (error: Error) => {
    if (error instanceof Error) {
      setErrorMessage(error.message);

      // Check if it's a verification error
      if (error.message.includes("Email not verified")) {
        try {
          const errorObject = error as {
            response?: { config?: { data?: string } };
          };
          let email: string | null = null;

          if (errorObject.response?.config?.data) {
            try {
              // Try to parse the JSON data
              const formData = JSON.parse(errorObject.response.config.data);
              email = formData.email;
            } catch {
              // If parsing fails, continue to fallback
            }
          }

          if (email) {
            setVerificationNeeded(email);
          } else {
            // Always set to a string value to ensure the button appears
            setVerificationNeeded("true");
          }
        } catch {
          // If extraction fails, set to true to show the button
          setVerificationNeeded("true");
        }
      }
    } else {
      setErrorMessage("An unknown error occurred");
    }
  };

  const handleResendVerification = async () => {
    if (!verificationNeeded) return;

    try {
      const redirectUrl =
        verificationNeeded !== "true"
          ? `/auth/resend-verification?email=${encodeURIComponent(verificationNeeded)}`
          : "/auth/resend-verification";

      router.push(redirectUrl);
    } catch (error) {
      console.error("Failed to redirect:", error);
    }
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
            {errorMessage && verificationNeeded && (
              <div className="p-3 text-sm text-red-500 bg-destructive/10 rounded-md">
                <p>{errorMessage}</p>
                <Button onClick={handleResendVerification} className="w-full">
                  Resend verification email
                </Button>
              </div>
            )}
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
