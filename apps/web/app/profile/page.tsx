"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/authStore";
import { Spinner } from "@/components/ui/spinner";
import { AvatarUpload } from "./AvatarUpload";
import { Notification } from "./Notification";
import { ProfileForm } from "./ProfileForm";
import { PasswordForm } from "./PasswordForm";

export default function ProfilePage() {
  const { user, isLoading } = useAuthStore();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleError = (message: string) => {
    setError(message);
    setSuccess(null);
  };

  const handleSuccess = (message: string) => {
    setSuccess(message);
    setError(null);
  };

  // Show loading state
  if (isLoading) {
    return <Spinner />;
  }
  
  // The middleware handles redirecting if not authenticated,
  // so we can assume user exists here
  if (!user) {
    return null; // This is a fallback that shouldn't normally happen
  }

  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Account Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Avatar */}
        <div className="md:col-span-1">
          <AvatarUpload 
            onError={handleError} 
            onSuccess={handleSuccess} 
          />
        </div>

        {/* Right column - Forms */}
        <div className="md:col-span-2">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>

            {/* Notification component for success/error messages */}
            <Notification error={error} success={success} />

            {/* Profile form */}
            <TabsContent value="profile">
              <ProfileForm 
                onError={handleError} 
                onSuccess={handleSuccess} 
              />
            </TabsContent>

            {/* Password form */}
            <TabsContent value="password">
              <PasswordForm 
                onError={handleError} 
                onSuccess={handleSuccess} 
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
