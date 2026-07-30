import type { Metadata } from "next";
import VerifyForm from "./VerifyForm";

export const metadata: Metadata = {
  title: "Verify – Bijou Sky",
  description: "Enter the verification code sent to your email.",
};

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Account
        </p>
        <h1 className="secHd">Verify</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Enter the 6-digit code we sent to your email to verify your account.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-15 md:py-20">
        <VerifyForm />
      </section>
    </div>
  );
}
