"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link, useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

const OTP_LENGTH = 6;

type VerifyFormValues = {
  otp: string;
};

export default function VerifyForm() {
  const router = useRouter();
  const email = useAuthStore((s) => s.email);
  const purpose = useAuthStore((s) => s.purpose);
  const token = useAuthStore((s) => s.token);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const isLoading = useAuthStore((s) => s.isLoading);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (token) return;
    if (!email || !purpose) {
      router.replace("/sign-in");
    }
  }, [email, purpose, token, router]);

  const onSubmit = async (data: VerifyFormValues) => {
    const currentPurpose = purpose;
    try {
      await verifyOtp(data.otp);
      if (currentPurpose === "PASSWORD_RESET") {
        router.push("/reset-password");
      } else {
        router.push("/profile");
      }
    } catch {
      // Error is stored in the auth store
    }
  };

  const handleResend = async () => {
    if (!email || !purpose) return;
    try {
      await sendOtp(email, purpose);
    } catch {
      // Error is stored in the auth store
    }
  };

  if (!token && (!email || !purpose)) {
    return null;
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
      noValidate
    >
      <p className="text-center text-sm text-gray-500">
        Code sent to <span className="font-medium text-primary">{email}</span>
      </p>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary text-center">
          Verification code
        </p>
        <Controller
          name="otp"
          control={control}
          rules={{
            required: "Verification code is required",
            minLength: {
              value: OTP_LENGTH,
              message: `Please enter the ${OTP_LENGTH}-digit code`,
            },
          }}
          render={({ field }) => (
            <InputOTP
              maxLength={OTP_LENGTH}
              value={field.value}
              onChange={field.onChange}
              aria-invalid={!!errors.otp}
              containerClassName="justify-center"
            >
              <InputOTPGroup className="gap-2">
                {Array.from({ length: OTP_LENGTH }).map((_, index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="size-11 rounded-lg border border-input text-base first:rounded-lg first:border-s last:rounded-lg"
                    aria-invalid={!!errors.otp}
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          )}
        />
        {errors.otp ? (
          <p className="text-center text-xs text-destructive" role="alert">
            {errors.otp.message}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isSubmitting || isLoading}>
        {isSubmitting || isLoading ? "Verifying..." : "Verify"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={isLoading}
          className="font-medium text-[#A37C43] underline-offset-2 hover:underline disabled:opacity-50"
        >
          Resend
        </button>
      </p>

      <p className="text-center text-sm text-gray-500">
        <Link
          href="/sign-in"
          className="font-medium text-[#A37C43] underline-offset-2 hover:underline"
        >
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
