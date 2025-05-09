import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {loginSchema} from '@/schemas/index'


import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { AuthError } from "@firebase/auth";
import { getFirebaseErrorMessage } from "@/types/authErrors";

export function Login({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    try {
      setLoading(true);
      setError(null);
      await login(values.email, values.password);
      console.log("Logged in successfully:", user);
      navigate("/", { replace: true });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error as AuthError);
      } else {
        setError({
          code: "unknown",
          message: "An unknown error occurred",
        } as AuthError);
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }
  if (user) {
    return <Navigate to="/" replace={true} />;
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)} {...props}>
          <Card>
            {error && (
              <p className="text-center text-red-500 font-light">
                {getFirebaseErrorMessage(error)}
              </p>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      {...register("email")}
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                    />
                    {errors.email?.message && (
                      <p className="text-red-500 text-sm font-light">
                        {errors.email?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      {...register("password")}
                      id="password"
                      type="password"
                      required
                    />
                    {errors.password?.message && (
                      <p className="text-red-500 text-sm font-light">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    <span>{loading ? "Logging..." : "Login"}</span>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
