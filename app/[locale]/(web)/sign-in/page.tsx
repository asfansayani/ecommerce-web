import type { Metadata } from "next";
import SignInForm from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign In – Bijou Sky",
  description: "Sign in to your Bijou Sky account.",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Account
        </p>
        <h1 className="secHd">Sign In</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Welcome back. Enter your details to access your account.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-15 md:py-20">
        <SignInForm />
      </section>
    </div>
  );
}
