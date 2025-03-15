"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { SignUpForm } from "./SignUpForm";
import { AuthResponse } from "@/lib/authTypes";

export default function RegisterPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSuccess = async (result: AuthResponse) => {
    router.push(`/auth/verification-pending?email=${encodeURIComponent(result.email)}`);
  };
  const handleError = (error: Error) => {
    setErrorMessage(error.message);
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex flex-row gap-1 justify-center text-xl">
              <p>Create your</p>
              <Link href="/" className="underline underline-offset-4">
                KwikDeals
              </Link>
              <p>account</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpForm
              onSuccess={handleSuccess}
              onError={handleError}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
              errorMessage={errorMessage}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
