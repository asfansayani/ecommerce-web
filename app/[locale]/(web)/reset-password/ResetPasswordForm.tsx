"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

type ResetPasswordFormValues = {
  password: string;
  confirmPassword: string;
};

export default function ResetPasswordForm() {
  const router = useRouter();
  const email = useAuthStore((s) => s.email);
  const otp = useAuthStore((s) => s.otp);
  const resetPassword = useAuthStore((s) => s.resetPassword);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  useEffect(() => {
    if (!email || !otp) {
      router.replace("/forgot-password");
    }
  }, [email, otp, router]);

  const onSubmit = async (data: ResetPasswordFormValues) => {
    try {
      await resetPassword({
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      router.push("/sign-in");
    } catch {
      // Error is stored in the auth store
    }
  };

  if (!email || !otp) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
      noValidate
    >
      <FormField
        label="Password"
        type="password"
        placeholder="Create a new password"
        autoComplete="new-password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />

      <FormField
        label="Confirm Password"
        type="password"
        placeholder="Confirm your new password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Remember your password?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-[#A37C43] underline-offset-2 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
