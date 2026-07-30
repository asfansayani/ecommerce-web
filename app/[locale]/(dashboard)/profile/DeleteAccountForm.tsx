"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";

type DeleteAccountValues = {
  password: string;
  confirmDelete: boolean;
};

export default function DeleteAccountForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountValues>({
    defaultValues: {
      password: "",
      confirmDelete: false,
    },
  });

  const onSubmit = async (data: DeleteAccountValues) => {
    // Placeholder until delete-account API is wired up
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Delete account submitted:", data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 rounded-lg border border-destructive/30 bg-white p-6 md:p-8"
      noValidate
    >
      <div>
        <h2 className="text-lg font-semibold text-destructive">
          Delete Account
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
      </div>

      <FormField
        label="Password"
        type="password"
        placeholder="Enter your password to confirm"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password", {
          required: "Password is required to delete your account",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        })}
      />

      <div className="flex flex-col gap-2">
        <Controller
          name="confirmDelete"
          control={control}
          rules={{
            validate: (value) =>
              value === true || "Please confirm you want to delete your account",
          }}
          render={({ field }) => (
            <label className="flex items-start gap-2.5 text-sm text-primary cursor-pointer">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
                aria-invalid={!!errors.confirmDelete}
                className="mt-0.5"
              />
              <span>
                I understand that deleting my account is permanent and cannot be
                undone.
              </span>
            </label>
          )}
        />
        {errors.confirmDelete ? (
          <p className="text-xs text-destructive" role="alert">
            {errors.confirmDelete.message}
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        variant="destructive"
        disabled={isSubmitting}
        className="self-start"
      >
        {isSubmitting ? "Deleting..." : "Delete Account"}
      </Button>
    </form>
  );
}
