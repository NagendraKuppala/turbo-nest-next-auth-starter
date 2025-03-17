"use client";

import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function NewsletterUnsubscribedPage() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success") === "true";
  const error = searchParams.get("error");
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-4">
        <Card className="p-4">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Newsletter Preferences</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4 pt-4">
            {success ? (
              <div className="text-center">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Successfully Unsubscribed</p>
                <p className="text-muted-foreground">
                  You have been unsubscribed from our newsletter and promotional emails.
                </p>
              </div>
            ) : (
              <div className="text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-lg font-medium mb-2">Unsubscribe Failed</p>
                <p className="text-muted-foreground">
                  {error || "We couldn't process your unsubscribe request. The link may be expired or invalid."}
                </p>
              </div>
            )}
            <Button asChild className="w-full mt-4">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}