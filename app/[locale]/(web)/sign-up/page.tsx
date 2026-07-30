import type { Metadata } from "next";
import SignUpForm from "./SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up – Bijou Sky",
  description: "Create a new Bijou Sky account.",
};

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Account
        </p>
        <h1 className="secHd">Sign Up</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Create your account to start shopping with Bijou Sky.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-15 md:py-20">
        <SignUpForm />
      </section>
    </div>
  );
}
