import { useState } from "react";
import { AuthError, createUserWithEmailAndPassword } from "firebase/auth";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { getFirebaseErrorMessage } from "@/types/authErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { registerSchema } from "@/schemas/index";

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
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { auth, db } from "@/config/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export function Register({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [showPassword, setShowpassword] = useState<boolean>(false);
  async function onSubmit(values: z.infer<typeof registerSchema>) {
    try {
      setLoading(true);
      setError(null);
      const res = await createUserWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const { user } = res;
      await addDoc(collection(db, "users"), {
        userId: user.uid,
        email: user.email,
        firstName: values.firstName,
        lastName: values.lastName,
        createdAt: Timestamp.fromDate(new Date()),
      });
      //get user password here and save to the db
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
              <CardTitle className="text-2xl">Register</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="firstName">Fistname</Label>
                    <Input
                      {...register("firstName")}
                      id="firstName"
                      type="text"
                      placeholder="Jon"
                      required
                    />
                    {errors.firstName?.message && (
                      <p className="text-red-500 text-sm font-light">
                        {errors.firstName?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="lastName">Lastname</Label>
                    <Input
                      {...register("lastName")}
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                    />
                    {errors.lastName?.message && (
                      <p className="text-red-500 text-sm font-light">
                        {errors.lastName?.message}
                      </p>
                    )}
                  </div>
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
                    <div className="flex items-center justify-between">
                      <Label htmlFor="password">Password</Label>
                      <button
                        type="button"
                        onClick={() => setShowpassword(!showPassword)}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                    <Input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                    />
                    {errors.password?.message && (
                      <p className="text-red-500 text-sm font-light">
                        {errors.password?.message}
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="passwordR">Repeat Password</Label>
                    <Input
                      {...register("confirmPassword")}
                      id="passwordR"
                      type={showPassword ? "text" : "password"}
                      required
                    />
                    {errors.confirmPassword?.message && (
                      <p className="text-red-500 text-sm font-light">
                        {errors.confirmPassword?.message}
                      </p>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    <span>{loading ? "Signing up..." : "Sign Up"}</span>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>
                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Sign in
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
