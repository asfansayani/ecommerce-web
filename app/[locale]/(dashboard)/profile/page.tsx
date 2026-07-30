import type { Metadata } from "next";
import ChangePasswordForm from "./ChangePasswordForm";
import DeleteAccountForm from "./DeleteAccountForm";
import ProfileUpdateForm from "./ProfileUpdateForm";

export const metadata: Metadata = {
  title: "Profile – Bijou Sky",
  description: "Manage your Bijou Sky profile, password, and account.",
};

export default function ProfilePage() {
  return (
    <div className="min-h-full">
      <div className="border-b border-border bg-[#F9F6F2] px-6 py-8 md:px-10 md:py-10">
        <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
          Account
        </p>
        <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
          Profile
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500">
          Manage your personal details, password, and account settings.
        </p>
      </div>

      <div className="flex max-w-3xl flex-col gap-8 px-6 py-8 md:px-10 md:py-12">
        <ProfileUpdateForm />
        <ChangePasswordForm />
        <DeleteAccountForm />
      </div>
    </div>
  );
}
