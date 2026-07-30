"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

type ProfileUpdateValues = {
  firstName: string;
  lastName: string;
  email: string;
};

export default function ProfileUpdateForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ProfileUpdateValues>({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const onSubmit = async (data: ProfileUpdateValues) => {
    // Placeholder until profile API is wired up
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Profile update submitted:", data);
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
          Update your name and email address.
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
        error={errors.email?.message}
        {...register("email", {
          required: "Email is required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email",
          },
        })}
      />

      {isSubmitSuccessful ? (
        <p className="text-sm text-[#A37C43]">Profile updated successfully.</p>
      ) : null}

      <Button type="submit" disabled={isSubmitting} className="self-start px-6">
        {isSubmitting ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
