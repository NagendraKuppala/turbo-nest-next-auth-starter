import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Info as InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { signUpSchema, SignUpFormData } from "@/lib/authTypes";
import { signUp as signUpApi } from "@/lib/auth";
import { useState } from "react";
import Link from "next/link";

interface SignUpFormProps {
  onSuccess: (result: AuthResponse) => void;
  onError: (error: Error) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  errorMessage: string | null;
}

export function SignUpForm({
  onSuccess,
  onError,
  isLoading,
  setIsLoading,
  errorMessage,
}: SignUpFormProps) {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      const result = await signUpApi(data);
      onSuccess(result);
    } catch (error) {
      onError(
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred")
      );
    } finally {
      setIsLoading(false);
    }
  };

  // File handling functions
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="flex justify-center mb-4">
        <div
          className="relative h-24 w-24 cursor-pointer rounded-full border-2 border-dashed border-border hover:border-primary/50 transition-colors"
          onClick={() => document.getElementById("avatarInput")?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {avatarPreview ? (
            <Image
              src={avatarPreview}
              alt="Avatar Preview"
              fill
              className="object-cover rounded-full"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm text-muted-foreground p-2">
              Add Profile Picture
            </div>
          )}
        </div>
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="">
          <Label htmlFor="firstName">
            First Name <span className="text-red-500">*</span>{" "}
          </Label>
          <Input id="firstName" placeholder="Kwik" {...register("firstName")} />
          {errors.firstName && (
            <p className="text-sm text-red-500">{errors.firstName.message}</p>
          )}
        </div>

        <div className="">
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" placeholder="Deals" {...register("lastName")} />
          {errors.lastName && (
            <p className="text-sm text-red-500">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="username">
          Username <span className="text-red-500">*</span>{" "}
        </Label>
        <Input
          id="username"
          placeholder="Deals Guru"
          {...register("username")}
        />
        {errors.username && (
          <p className="text-sm text-red-500">{errors.username.message}</p>
        )}
      </div>

      <div className="">
        <Label htmlFor="email">
          Email <span className="text-red-500">*</span>{" "}
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Label htmlFor="password">
            Password <span className="text-red-500">*</span>{" "}
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <div className="space-y-2">
                  <p className="font-semibold">Password requirements:</p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>Minimum 8 characters long</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character (@$!%*?&)</li>
                  </ul>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="">
        <Label htmlFor="confirmPassword">
          Confirm Password <span className="text-red-500">*</span>{" "}
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errorMessage && (
        <p className="text-sm text-red-500 text-center">{errorMessage}</p>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating Account..." : "Create Account"}
      </Button>
      <div className="text-center text-sm m-4">
        Already have an account?{" "}
        <Link href="/auth/signin" className="font-semibold underline">
          Sign in
        </Link>
      </div>
    </form>
  );
}
