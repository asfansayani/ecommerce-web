import type { Metadata } from "next";
import CheckoutPageContent from "@/components/checkout/CheckoutPageContent";

export const metadata: Metadata = {
  title: "Checkout – Bijou Sky",
  description: "Enter your shipping details and place your Bijou Sky order.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-[70vh]">
      <div className="border-b border-border bg-[#F9F6F2] py-8 md:py-10">
        <div className="container">
          <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
            Shopping
          </p>
          <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            Confirm your address and review your order before placing it.
          </p>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <CheckoutPageContent />
      </div>
    </div>
  );
}
