import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { signInSchema, SignInFormData, AuthResponse } from "@/lib/authTypes";
import { signIn } from "@/lib/auth";

interface SignInFormProps {
  onSuccess: (result: AuthResponse) => void;
  onError: (error: Error) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  errorMessage: string | null;
}

export function SignInForm({
  onSuccess,
  onError,
  isLoading,
  setIsLoading,
  errorMessage,
}: SignInFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    setIsLoading(true);
    try {
      const result = await signIn(data);
      onSuccess(result);
    } catch (error: unknown) {
      onError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4">
        {errorMessage && (
          <div className="p-3 text-sm text-red-500 bg-destructive/10 rounded-md">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Button
            variant="outline"
            className="w-full"
            type="button"
            asChild
          >
            <a
              href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/login`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="100"
                height="100"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#fbc02d"
                  d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
                <path
                  fill="#e53935"
                  d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                ></path>
                <path
                  fill="#1565c0"
                  d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                ></path>
              </svg>
              Sign In with Google
            </a>
          </Button>

          <div className="relative text-center text-sm">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 border" />
              <span className="text-muted-foreground">Or continue with</span>
              <div className="h-px flex-1 border" />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              {...register("email")}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="grid gap-2">
            <div className="flex items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/forgot-password"
                className="ml-auto text-sm hover:underline hover:underline-offset-4"
              >
                Forgot your password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              placeholder="********"
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </div>
        <div className="text-center text-sm pb-4">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="font-semibold underline">
            Sign up
          </Link>
        </div>
      </div>
    </form>
  );
}
