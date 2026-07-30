import type { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";

export const metadata: Metadata = {
  title: "Forgot Password – Bijou Sky",
  description: "Reset your Bijou Sky account password.",
};

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Account
        </p>
        <h1 className="secHd">Forgot Password</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-15 md:py-20">
        <ForgotPasswordForm />
      </section>
    </div>
  );
}
