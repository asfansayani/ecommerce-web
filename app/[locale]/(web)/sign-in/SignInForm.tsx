"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Link, useRouter } from "@/i18n/navigation";
import { AuthApiError } from "@/lib/api/auth";
import { useAuthStore } from "@/store/authStore";
import { routing } from "@/i18n/routing";

type SignInFormValues = {
  email: string;
  password: string;
};

function toLocalePath(callbackUrl: string) {
  const segments = callbackUrl.split("/");
  const maybeLocale = segments[1];

  if (
    routing.locales.includes(
      maybeLocale as (typeof routing.locales)[number]
    )
  ) {
    const rest = `/${segments.slice(2).join("/")}`;
    return rest === "/" ? "/" : rest.replace(/\/$/, "") || "/";
  }

  return callbackUrl.startsWith("/") ? callbackUrl : "/profile";
}

export default function SignInForm() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await login(data.email, data.password);
      const callbackUrl = new URLSearchParams(window.location.search).get(
        "callbackUrl"
      );
      router.push(callbackUrl ? toLocalePath(callbackUrl) : "/profile");
    } catch (err) {
      if (err instanceof AuthApiError && err.statusCode === 409) {
        router.push("/verify");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex w-full flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
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

      <FormField
        label="Password"
        type="password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />

      <div className="-mt-2 text-end">
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-[#A37C43] underline-offset-2 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Signing in..." : "Sign In"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-medium text-[#A37C43] underline-offset-2 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
