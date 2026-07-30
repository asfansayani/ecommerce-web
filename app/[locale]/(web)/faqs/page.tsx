import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { getContentSections } from "@/lib/api/content-sections";
import { getTranslation } from "@/lib/helpers/getTranslation";
import FaqAccordion from "./FaqAccordion";

export const metadata: Metadata = {
  title: "FAQs – Bijou Sky",
  description:
    "Find answers to frequently asked questions about Bijou Sky jewellery, orders, shipping, and returns.",
};

export default async function FaqsPage() {
  const locale = await getLocale();
  const response = await getContentSections("FAQs");
  const section = response?.data?.[0];
  const sectionTranslation = getTranslation(section?.translations, locale);

  const items =
    section?.subContent
      .map((item) => {
        const translation = getTranslation(item.translations, locale);
        return {
          id: item.id,
          question: translation?.title?.trim() || "",
          answer: translation?.description?.trim() || "",
        };
      })
    ?? [];

  const heading =
    sectionTranslation?.title?.trim() || "Frequently Asked Questions";

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Help Centre
        </p>
        <h1 className="secHd">{heading}</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Can&apos;t find an answer? Email us at{" "}
          <a
            href="mailto:support@bijousky.com"
            className="text-[#A37C43] underline"
          >
            support@bijousky.com
          </a>{" "}
          and we&apos;ll be happy to help.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-15 md:py-20">
        {items.length > 0 ? (
          <FaqAccordion items={items} />
        ) : (
          <p className="text-sm text-gray-500 text-center">
            FAQs are currently unavailable. Please try again later.
          </p>
        )}
      </section>
    </div>
  );
}
