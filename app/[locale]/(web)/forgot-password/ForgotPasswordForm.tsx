"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

type ForgotPasswordFormValues = {
  email: string;
};

export default function ForgotPasswordForm() {
  const router = useRouter();
  const sendOtp = useAuthStore((s) => s.sendOtp);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    try {
      await sendOtp(data.email, "PASSWORD_RESET");
      router.push("/verify");
    } catch {
      // Error is stored in the auth store
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
      noValidate
    >
      <FormField
        label="Email"
        type="email"
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email",
          },
        })}
      />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Sending..." : "Send Code"}
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
