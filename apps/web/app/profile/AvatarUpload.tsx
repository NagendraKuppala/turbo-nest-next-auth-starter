"use client";

import React, { useState, useRef } from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { updateAvatar } from "@/lib/auth";
import Image from "next/image";
import { updateSession } from "@/lib/session";

interface AvatarUploadProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function AvatarUpload({ onError, onSuccess }: AvatarUploadProps) {
  const { user, updateUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;

    const file = e.target.files[0];
    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      onError("File size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const data = await updateAvatar(file);
      updateUser({ avatar: data.avatar });
      await updateSession({ avatar: data.avatar });
      onSuccess("Avatar updated successfully!");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center p-4">
        <div className="mb-6">
          <Avatar className="w-32 h-32">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.username}
                width={128}
                height={128}
                style={{ objectFit: "cover" }}
              />
            ) : (
              <div className="bg-primary text-white w-full h-full flex items-center justify-center text-2xl">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
            )}
          </Avatar>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="hidden"
        />

        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Change Picture"}
        </Button>
      </CardContent>
    </Card>
  );
}