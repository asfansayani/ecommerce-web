"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

type SignUpFormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
};

export default function SignUpForm() {
  const router = useRouter();
  const signup = useAuthStore((s) => s.signup);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      acceptTerms: false,
    },
  });

  const password = watch("password");

  const onSubmit = async (data: SignUpFormValues) => {
    try {
      await signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      router.push("/verify");
    } catch {
      // Error is stored in the auth store
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
      noValidate
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <FormField
          label="First Name"
          placeholder="First name"
          autoComplete="given-name"
          error={errors.firstName?.message}
          {...register("firstName", {
            required: "First name is required",
            minLength: {
              value: 2,
              message: "First name must be at least 2 characters",
            },
          })}
        />

        <FormField
          label="Last Name"
          placeholder="Last name"
          autoComplete="family-name"
          error={errors.lastName?.message}
          {...register("lastName", {
            required: "Last name is required",
            minLength: {
              value: 2,
              message: "Last name must be at least 2 characters",
            },
          })}
        />
      </div>

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
        placeholder="Create a password"
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
        placeholder="Confirm your password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your password",
          validate: (value) =>
            value === password || "Passwords do not match",
        })}
      />

      <div className="flex flex-col gap-2">
        <Controller
          name="acceptTerms"
          control={control}
          rules={{
            validate: (value) =>
              value === true || "You must agree to the terms and privacy policy",
          }}
          render={({ field }) => (
            <label className="flex items-start gap-2.5 text-sm text-primary cursor-pointer">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.acceptTerms}
                className="mt-0.5"
              />
              <span>
                Agree to{" "}
                <Link
                  href="/terms-and-conditions"
                  className="underline underline-offset-2 hover:text-[#A37C43]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Terms And Conditions
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy-policy"
                  className="underline underline-offset-2 hover:text-[#A37C43]"
                  onClick={(e) => e.stopPropagation()}
                >
                  Privacy Policy
                </Link>
              </span>
            </label>
          )}
        />
        {errors.acceptTerms ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.acceptTerms.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating account..." : "Sign Up"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Already have an account?{" "}
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
