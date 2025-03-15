import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { signUp as signUpApi } from "@/lib/auth";
import { AuthResponse, SignUpFormData, signUpSchema } from "@/lib/authTypes";
import ReCAPTCHA from "react-google-recaptcha";
import { Checkbox } from "@/components/ui/checkbox";
import { useRef } from "react";

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
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      termsAccepted: false,
      newsletterOptIn: false,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: SignUpFormData) => {
    setIsLoading(true);
    try {
      if (!recaptchaRef.current) {
        throw new Error("reCAPTCHA not loaded");
      }
      const token = await recaptchaRef.current?.executeAsync();
      if (!token) {
        throw new Error("CAPTCHA verification failed");
      }
      const formData = {
        ...data,
        recaptchaToken: token,
      };
      const result = await signUpApi(formData);
      onSuccess(result);
    } catch (error) {
      onError(
        error instanceof Error
          ? error
          : new Error("An unexpected error occurred")
      );
      if (recaptchaRef.current) recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  // Use direct registration for checkbox to ensure its value is properly tracked
  const handleTermsAccepted = (checked: boolean | "indeterminate") => {
    setValue("termsAccepted", checked === true, {
      shouldValidate: true,
    });
  };

  const handleNewsletterOptIn = (checked: boolean | "indeterminate") => {
    setValue("newsletterOptIn", checked === true);
  };

  const termsAccepted = watch("termsAccepted");
  const newsletterOptIn = watch("newsletterOptIn");

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

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="termsAccepted"
            checked={termsAccepted}
            onCheckedChange={handleTermsAccepted}
          />
          <label htmlFor="termsAccepted" className="text-sm">
            I accept the{" "}
            <Link
              href="/terms"
              className="text-primary underline hover:text-primary/90"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary underline hover:text-primary/90"
            >
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.termsAccepted && (
          <p className="text-sm text-red-500">{errors.termsAccepted.message}</p>
        )}

        <div className="flex items-center space-x-2">
          <Checkbox
            id="newsletterOptIn"
            checked={newsletterOptIn}
            onCheckedChange={handleNewsletterOptIn}
          />
          <label htmlFor="newsletterOptIn" className="text-sm">
            Send me updates about deals and promotions (optional)
          </label>
        </div>
      </div>

      <ReCAPTCHA
        ref={recaptchaRef}
        size="invisible"
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
      />

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || isSubmitting}
      >
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
