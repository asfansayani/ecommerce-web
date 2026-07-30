"use client";

import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormField } from "@/components/ui/form-field";
import { useRouter } from "@/i18n/navigation";
import { useAuthStore } from "@/store/authStore";

type DeleteAccountValues = {
  email: string;
  confirmDelete: boolean;
};

export default function DeleteAccountForm() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const deleteAccount = useAuthStore((s) => s.deleteAccount);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<DeleteAccountValues>({
    defaultValues: {
      email: "",
      confirmDelete: false,
    },
  });

  const onSubmit = async () => {
    try {
      await deleteAccount();
      router.push("/sign-in");
    } catch {
      // Error is stored in the auth store
    }
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
          cannot be undone. Type your email to confirm.
        </p>
      </div>

      <FormField
        label="Email"
        type="email"
        placeholder="Enter your email to confirm"
        autoComplete="email"
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required to delete your account",
          validate: (value) => {
            if (!user?.email) {
              return "Unable to verify your email. Please sign in again.";
            }
            return (
              value.trim().toLowerCase() === user.email.trim().toLowerCase() ||
              "Email does not match your account email"
            );
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
