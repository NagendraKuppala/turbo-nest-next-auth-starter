"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import Link from "next/link";
import { resendVerification } from "@/lib/auth";

export default function VerificationPendingPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [isResending, setIsResending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResendEmail = async () => {
    if (!email) return;
    
    setIsResending(true);
    setErrorMessage(null);

    try {
      await resendVerification(email);
      setIsSuccess(true);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to resend verification email"
      );
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-4">
            <Mail className="h-16 w-16 text-primary/80 mb-2" />
            
            <div className="text-center">
              <p className="text-lg font-medium mb-2">Check your inbox</p>
              <p className="text-muted-foreground mb-2">
                We&apos;ve sent a verification link to:
              </p>
              <p className="font-medium mb-4">{email}</p>
              <p className="text-sm text-muted-foreground">
                Click the link in the email to verify your account. If you don&apos;t see the email, check your spam folder.
              </p>
            </div>

            {isSuccess && (
              <div className="w-full p-3 text-sm text-green-700 bg-green-100 rounded-md">
                Verification email sent successfully!
              </div>
            )}

            {errorMessage && (
              <div className="w-full p-3 text-sm text-red-500 bg-destructive/10 rounded-md">
                {errorMessage}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              onClick={handleResendEmail}
              variant="outline"
              className="w-full"
              disabled={isResending}
            >
              {isResending ? "Sending..." : "Resend verification email"}
            </Button>
            <Button asChild variant="ghost" className="w-full">
              <Link href="/auth/signin">Back to Sign In</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}