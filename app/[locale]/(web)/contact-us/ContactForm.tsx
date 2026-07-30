"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";

type ContactFormValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    // Placeholder until a contact API is wired up
    await new Promise((resolve) => setTimeout(resolve, 600));
    console.log("Contact form submitted:", data);
    reset();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-xl flex-col gap-5"
      noValidate
    >
      <FormField
        label="Full Name"
        placeholder="Your name"
        autoComplete="name"
        error={errors.name?.message}
        {...register("name", {
          required: "Name is required",
          minLength: { value: 2, message: "Name must be at least 2 characters" },
        })}
      />

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
        label="Subject"
        placeholder="How can we help?"
        error={errors.subject?.message}
        {...register("subject", {
          required: "Subject is required",
        })}
      />

      <FormField
        as="textarea"
        label="Message"
        placeholder="Write your message here..."
        rows={5}
        error={errors.message?.message}
        {...register("message", {
          required: "Message is required",
          minLength: {
            value: 10,
            message: "Message must be at least 10 characters",
          },
        })}
      />

      {isSubmitSuccessful ? (
        <p className="text-sm text-[#A37C43]">
          Thank you — your message has been sent. We&apos;ll get back to you soon.
        </p>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
