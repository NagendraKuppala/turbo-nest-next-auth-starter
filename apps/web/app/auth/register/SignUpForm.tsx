import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { signUp as signUpApi } from "@/lib/auth";
import { AuthResponse, SignUpFormData, signUpSchema } from "@/lib/authTypes";

interface SignUpFormProps {
  onSuccess: (data: AuthResponse) => void;
  onError: (error: Error) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  errorMessage: string | null;
}

export function SignUpForm({
  onSuccess,
  onError,
  isLoading,
  setIsLoading,
  errorMessage,
}: SignUpFormProps) {
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
      console.log('Form data being submitted:', data);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <Info className="h-4 w-4 text-muted-foreground" />
                </div>
              </TooltipTrigger>
              <TooltipContent className="w-80">
                <div className="space-y-2">
                  <p className="font-semibold">Password requirements:</p>
                  <ul className="list-inside list-disc space-y-1 text-sm">
                    <li>At least 8 characters</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
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
