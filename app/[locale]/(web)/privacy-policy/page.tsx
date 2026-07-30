import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getPage } from "@/lib/api/pages";
import { getTranslation } from "@/lib/helpers/getTranslation";
import { PAGE_IDS } from "@/types/page";
import CmsHtmlContent from "@/components/website/CmsHtmlContent";

export const metadata: Metadata = {
  title: "Privacy Policy – Bijou Sky",
  description:
    "Learn how Bijou Sky collects, uses, and protects your personal information.",
};

export default async function PrivacyPolicyPage() {
  const locale = await getLocale();
  const response = await getPage(PAGE_IDS.PRIVACY_POLICY);
  const translation = getTranslation(response?.data?.translations, locale);
  const html = translation?.content ?? "";

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Legal
        </p>
        <h1 className="secHd">Privacy Policy</h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-15 md:py-20">
        {html ? (
          <CmsHtmlContent html={html} />
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Content is currently unavailable. Please try again later.
          </p>
        )}
      </section>
    </div>
  );
}
