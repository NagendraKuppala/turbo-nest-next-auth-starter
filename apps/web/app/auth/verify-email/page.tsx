"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { verifyEmail } from "@/lib/auth";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function verifyUserEmail() {
      if (!token) {
        setIsVerifying(false);
        setErrorMessage("Missing verification token");
        return;
      }

      try {
        await verifyEmail(token);
        setIsSuccess(true);
        setIsVerifying(false);
      } catch (error) {
        setIsSuccess(false);
        setIsVerifying(false);
        setErrorMessage(
          error instanceof Error ? error.message : "Email verification failed"
        );
      }
    }

    verifyUserEmail();
  }, [token]);

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-4">
            {isVerifying && (
              <div className="text-center">
                <div className="my-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p>Verifying your email address...</p>
              </div>
            )}

            {!isVerifying && isSuccess && (
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Email verified successfully!</p>
                <p className="text-muted-foreground">You can now sign in to your account.</p>
              </div>
            )}

            {!isVerifying && !isSuccess && (
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Verification failed</p>
                <p className="text-muted-foreground mb-2">{errorMessage || "An error occurred during verification"}</p>
                <p className="text-sm">
                  The verification link may have expired or is invalid.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            {isSuccess ? (
              <Button asChild className="w-full">
                <Link href="/auth/signin">Sign in</Link>
              </Button>
            ) : (
              <div className="w-full flex flex-col gap-2">
                {!isVerifying && (
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/auth/resend-verification">Resend verification email</Link>
                  </Button>
                )}
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/">Back to home</Link>
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}