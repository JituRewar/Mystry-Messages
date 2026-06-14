'use client'

import { verifySchema } from "@/schemas/verifySchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from 'zod';
import { Loader2, ShieldCheck } from "lucide-react";
import {
  Field,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

const VerifyAccount = () => {
    const router = useRouter();
    const params = useParams<{ username: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);

    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [cooldown]);

    const onResend = async () => {
        setIsResending(true);
        try {
            const response = await axios.post('/api/resend-code', {
                username: params.username,
            });
            toast.success(response.data.message || "Verification code resent successfully");
            setCooldown(60); // 60s cooldown
        } catch (error) {
            console.error("Error resending verification code", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to resend code");
        } finally {
            setIsResending(false);
        }
    };
 
    const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
      defaultValues: {
        code: "",
      },
    });

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = form;

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        setIsSubmitting(true);
        try {
            const response = await axios.post('/api/verify-code', {
                username: params.username,
                code: data.code
            });
            toast.success(response.data.message || "Code verified successfully");
            router.replace('/sign-in');
        } catch (error) {
            console.error("Error in verifying code", error);
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message || "Failed to verify code");
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
              <ShieldCheck className="h-8 w-8 text-purple-500" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Verify Your Account
            </h2>
            <p className="mt-2 text-sm text-slate-400">
              Enter the verification code sent to your email to activate your account.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
            <div className="space-y-5">
              <Field data-invalid={!!errors.code}>
                <FieldContent>
                  <FieldLabel htmlFor="code" className="text-slate-300">
                    Verification Code
                  </FieldLabel>
                  <FieldDescription className="text-slate-400 text-xs">
                    Please enter the 6-digit code.
                  </FieldDescription>
                  {errors.code && <FieldError>{errors.code.message}</FieldError>}
                </FieldContent>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ShieldCheck className="h-4 w-4 text-slate-500" />
                  </div>
                  <Input
                    id="code"
                    placeholder="Enter 6-digit code"
                    {...register("code")}
                    className="pl-9 h-10 bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-purple-500/50 focus-visible:border-purple-500"
                  />
                </div>
              </Field>
            </div>

            <div className="pt-2 flex flex-col gap-3">
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
                    Verifying...
                  </>
                ) : (
                  "Verify Account"
                )}
              </button>

              <button
                type="button"
                onClick={onResend}
                disabled={isResending || cooldown > 0}
                className={`w-full py-2.5 px-4 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 hover:text-white rounded-lg text-sm font-semibold transition-all duration-200 flex justify-center items-center cursor-pointer ${
                  (isResending || cooldown > 0) ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isResending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resending...
                  </>
                ) : cooldown > 0 ? (
                  `Resend Code in ${cooldown}s`
                ) : (
                  "Resend Code to Email"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
};

export default VerifyAccount;
