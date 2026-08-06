import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import NotFoundContent from "@/components/common/NotFoundContent";

export const metadata: Metadata = {
  title: "Page Not Found – Bijou Sky",
  description: "The page you are looking for could not be found.",
};

export default async function NotFound() {
  const locale = await getLocale();

  return (
    <>
      <Header />
      <main>
        <NotFoundContent />
        <Footer locale={locale} />
      </main>
    </>
  );
}
