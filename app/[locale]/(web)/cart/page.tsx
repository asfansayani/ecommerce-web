import type { Metadata } from "next";
import CartPageContent from "@/components/cart/CartPageContent";

export const metadata: Metadata = {
  title: "Cart – Bijou Sky",
  description: "Review the jewellery pieces in your cart before checkout.",
};

export default function CartPage() {
  return (
    <div className="min-h-[70vh]">
      <div className="border-b border-border bg-[#F9F6F2] py-8 md:py-10">
        <div className="container">
          <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
            Shopping
          </p>
          <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
            Your Cart
          </h1>
          <p className="mt-2 max-w-xl text-sm text-gray-500">
            Review your selected pieces before you proceed to checkout.
          </p>
        </div>
      </div>

      <div className="container py-8 md:py-12">
        <CartPageContent />
      </div>
    </div>
  );
}
