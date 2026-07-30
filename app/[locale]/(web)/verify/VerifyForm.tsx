"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Link } from "@/i18n/navigation";

const OTP_LENGTH = 6;

type VerifyFormValues = {
  otp: string;
};

export default function VerifyForm() {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<VerifyFormValues>({
    defaultValues: {
      otp: "",
    },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    // Placeholder until verify API is wired up
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Verify submitted:", data);
  };

  const handleResend = async () => {
    // Placeholder until resend API is wired up
    await new Promise((resolve) => setTimeout(resolve, 400));
    console.log("Resend code requested");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-primary text-center">Verification code</p>
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

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Verifying..." : "Verify"}
      </Button>

      <p className="text-center text-sm text-gray-500">
        Didn&apos;t receive the code?{" "}
        <button
          type="button"
          onClick={handleResend}
          className="font-medium text-[#A37C43] underline-offset-2 hover:underline"
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
