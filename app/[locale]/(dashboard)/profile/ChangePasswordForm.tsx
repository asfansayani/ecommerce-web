"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export default function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ChangePasswordValues>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: ChangePasswordValues) => {
    // Placeholder until change-password API is wired up
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Change password submitted:", data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
      noValidate
    >
      <div>
        <h2 className="text-lg font-semibold text-primary">Change Password</h2>
        <p className="mt-1 text-sm text-gray-500">
          Choose a strong password you haven&apos;t used before.
        </p>
      </div>

      <FormField
        label="Current Password"
        type="password"
        placeholder="Enter current password"
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        {...register("currentPassword", {
          required: "Current password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />

      <FormField
        label="New Password"
        type="password"
        placeholder="Enter new password"
        autoComplete="new-password"
        error={errors.newPassword?.message}
        {...register("newPassword", {
          required: "New password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />

      <FormField
        label="Confirm New Password"
        type="password"
        placeholder="Confirm new password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword", {
          required: "Please confirm your new password",
          validate: (value) =>
            value === newPassword || "Passwords do not match",
        })}
      />

      {isSubmitSuccessful ? (
        <p className="text-sm text-[#A37C43]">Password changed successfully.</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="self-start">
        {isSubmitting ? "Updating..." : "Update Password"}
      </Button>
    </form>
  );
}
