"use client";

import { useState, useEffect, useMemo } from "react"; // Import useMemo
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { createSession } from "@/lib/session";
import { acceptOAuthTerms } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";

export default function TermsAcceptancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Memoize the userData object to prevent useEffect from re-running unnecessarily
  const userData = useMemo(
    () => ({
      accessToken: searchParams.get("accessToken") || "",
      refreshToken: searchParams.get("refreshToken") || "",
      userId: searchParams.get("userId") || "",
      email: searchParams.get("email") || "",
      username: searchParams.get("username") || "",
      firstName: searchParams.get("firstName") || "",
      lastName: searchParams.get("lastName") || "",
      role: (searchParams.get("role") as "USER" | "ADMIN") || "USER",
      avatar: searchParams.get("avatar") || "",
      emailVerified: searchParams.get("emailVerified") === "true",
    }),
    [searchParams]
  ); // Only re-create when searchParams change

  const handleAcceptTerms = async () => {
    if (!termsAccepted) {
      setErrorMessage(
        "You must accept the Terms and Privacy Policy to continue"
      );
      return;
    }

    setIsLoading(true);
    try {
      // Record terms acceptance
      await acceptOAuthTerms(
        userData.userId,
        termsAccepted,
        newsletterOptIn,
        userData.accessToken
      );

      // Create client-side session
      await createSession({
        user: {
          id: userData.userId,
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          avatar: userData.avatar,
          emailVerified: userData.emailVerified,
        },
        accessToken: userData.accessToken,
        refreshToken: userData.refreshToken,
      });

      // Update the auth store explicitly to ensure UI components update
      useAuthStore.setState({
        isAuthenticated: true,
        user: {
          id: userData.userId,
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          lastName: userData.lastName || "",
          role: userData.role,
          avatar: userData.avatar || "",
          emailVerified: userData.emailVerified,
        },
        isLoading: false,
      });

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Error accepting terms:", error);
      setErrorMessage("Failed to accept terms. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Prevent access to this page directly without OAuth params
  useEffect(() => {
    if (!userData.userId || !userData.accessToken) {
      router.push("/auth/signin");
    }
  }, [userData, router]); // Now userData won't change unless searchParams change

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Card className="p-4">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">
              Accept Terms & Privacy Policy
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Please review and accept our terms before continuing
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="termsAccepted"
                  checked={termsAccepted}
                  onCheckedChange={(checked) =>
                    setTermsAccepted(checked === true)
                  }
                />
                <label htmlFor="termsAccepted" className="text-sm">
                  I accept the{" "}
                  <Link
                    href="/terms"
                    className="text-primary underline hover:text-primary/90"
                    target="_blank"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary underline hover:text-primary/90"
                    target="_blank"
                  >
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="newsletterOptIn"
                  checked={newsletterOptIn}
                  onCheckedChange={(checked) =>
                    setNewsletterOptIn(checked === true)
                  }
                />
                <label htmlFor="newsletterOptIn" className="text-sm">
                  Send me updates about deals and promotions (optional)
                </label>
              </div>
            </div>

            {errorMessage && (
              <p className="text-sm text-red-500 text-center">{errorMessage}</p>
            )}

            <Button
              type="button"
              className="w-full"
              disabled={isLoading}
              onClick={handleAcceptTerms}
            >
              {isLoading ? "Processing..." : "Continue"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
