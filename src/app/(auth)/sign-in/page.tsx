"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Lock, User, Eye, EyeOff } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { signInSchema } from "@/schemas/signInSchema";
import { signIn } from "next-auth/react";

function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        identifier: data.identifier,
        password: data.password
      });

      if (result?.error) {
        if (result.error === 'CredentialsSignin') {
          toast.error('Incorrect username or password');
        } else {
          toast.error(result.error || "Login failed");
        }
      }

      if (result?.ok) {
        router.replace('/dashboard');
      }
    } catch (error) {
      console.error("Error signing in", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-purple-600/20 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl opacity-50 pointer-events-none" />

      <div className="w-full max-w-md space-y-8 p-8 bg-slate-950/65 backdrop-blur-xl border border-slate-800/80 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center p-3 bg-purple-600/10 rounded-xl border border-purple-500/20 mb-4">
            <svg
              className="h-8 w-8 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Welcome Back to Mystery Message
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Sign in to start your anonymous adventure
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6" autoComplete="off">
          <div className="space-y-5">
            {/* Identifier Field */}
            <Field data-invalid={!!errors.identifier}>
              <FieldContent>
                <FieldLabel htmlFor="identifier" className="text-slate-300">
                  Email or Username
                </FieldLabel>
                <FieldDescription className="text-slate-400 text-xs">
                  Enter your registered email or username.
                </FieldDescription>
                {errors.identifier && <FieldError>{errors.identifier.message}</FieldError>}
              </FieldContent>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-4 w-4 text-slate-500" />
                </div>
                <Input
                  id="identifier"
                  placeholder="Enter your email or username"
                  {...register("identifier")}
                  autoComplete="off"
                  className="pl-9 h-10 bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500"
                />
              </div>
            </Field>

            {/* Password Field */}
            <Field data-invalid={!!errors.password}>
              <FieldContent>
                <FieldLabel htmlFor="password" className="text-slate-300">
                  Password
                </FieldLabel>
                <FieldDescription className="text-slate-400 text-xs">
                  Enter your password.
                </FieldDescription>
                {errors.password && <FieldError>{errors.password.message}</FieldError>}
              </FieldContent>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                  autoComplete="new-password"
                  className="pl-9 pr-9 h-10 bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </Field>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-linear-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-purple-500 transition-all duration-200 flex justify-center items-center ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            New to Mystery Message?{" "}
            <Link href="/sign-up" className="font-semibold text-purple-400 hover:text-purple-300 underline transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Page;
