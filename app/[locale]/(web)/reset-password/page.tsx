import type { Metadata } from "next";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password – Bijou Sky",
  description: "Choose a new password for your Bijou Sky account.",
};

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Account
        </p>
        <h1 className="secHd">Reset Password</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Enter your new password below to complete the reset.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-15 md:py-20">
        <ResetPasswordForm />
      </section>
    </div>
  );
}
