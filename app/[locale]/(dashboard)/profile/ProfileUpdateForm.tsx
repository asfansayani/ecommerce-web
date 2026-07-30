"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useAuthStore } from "@/store/authStore";

type ProfileUpdateValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function ProfileUpdateForm() {
  const user = useAuthStore((s) => s.user);
  const updateProfile = useAuthStore((s) => s.updateProfile);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProfileUpdateValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  useEffect(() => {
    if (!user) return;

    reset({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
    });
  }, [user, reset]);

  const onSubmit = async (data: ProfileUpdateValues) => {
    try {
      await updateProfile({
        firstName: data.firstName,
        lastName: data.lastName,
      });
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
      <div>
        <h2 className="text-lg font-semibold text-primary">Update Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          Update your first and last name. Email cannot be changed.
        </p>
      </div>

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
        disabled
        {...register("email")}
      />

      <Button type="submit" disabled={isSubmitting} className="self-start px-6">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
