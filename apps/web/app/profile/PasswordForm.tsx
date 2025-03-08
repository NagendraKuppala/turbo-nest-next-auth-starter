"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { passwordSchema, PasswordFormValues } from "@/lib/authTypes";
import { updatePassword } from "@/lib/auth";

interface PasswordFormProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function PasswordForm({ onError, onSuccess }: PasswordFormProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSubmit = async (data: PasswordFormValues) => {
    setIsUpdating(true);
    
    try {
      await updatePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      reset();
      onSuccess("Password changed successfully!");
    } catch (error) {
      onError(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change Password</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">
              Current Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">
              New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Change Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}