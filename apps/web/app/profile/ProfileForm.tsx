"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuthStore } from "@/store/authStore";
import { profileSchema, ProfileFormValues } from "@/lib/authTypes";
import { updateProfile } from "@/lib/auth";

interface ProfileFormProps {
  onError: (message: string) => void;
  onSuccess: (message: string) => void;
}

export function ProfileForm({ onError, onSuccess }: ProfileFormProps) {
  const { user, updateUser } = useAuthStore();
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      username: user?.username || "",
      email: user?.email || "",
      newsletterOptIn: Boolean(user?.newsletterOptIn),
    },
    mode: "onChange",
  });

  // Reset form when user data is available
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName || "",
        username: user.username,
        email: user.email,
        newsletterOptIn: Boolean(user.newsletterOptIn),
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsUpdating(true);

    try {
      // Create a new object without the email field
      const updatedData = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        newsletterOptIn: data.newsletterOptIn,
      };

      const response = await updateProfile(updatedData);
      updateUser(response);
      onSuccess("Profile updated successfully!");
    } catch (error) {
      onError(
        error instanceof Error ? error.message : "Failed to update profile"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (!user) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input id="firstName" {...register("firstName")} />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" {...register("lastName")} />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">
              Username <span className="text-red-500">*</span>
            </Label>
            <Input id="username" {...register("username")} />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              {...register("email")}
              disabled={true}
              readOnly={true}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="newsletterOptIn"
                checked={watch("newsletterOptIn")}
                onCheckedChange={(checked) =>
                  setValue("newsletterOptIn", checked === true)
                }
              />
              <Label htmlFor="newsletterOptIn">
                Receive newsletter, deals, and promotional emails
              </Label>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isUpdating}>
            {isUpdating ? "Updating..." : "Update Profile"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
