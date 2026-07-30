import type { Metadata } from "next";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact Us – Bijou Sky",
  description:
    "Get in touch with Bijou Sky. Send us a message and our team will be happy to help.",
};

export default function ContactUsPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Get in Touch
        </p>
        <h1 className="secHd">Contact Us</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Have a question about an order, product, or something else? Fill out
          the form below and we&apos;ll reply as soon as we can.
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-15 md:py-20">
        <ContactForm />
      </section>
    </div>
  );
}
