import type { Metadata } from "next";
import TrackOrderForm from "./TrackOrderForm";

export const metadata: Metadata = {
  title: "Track Order – Bijou Sky",
  description: "Track your Bijou Sky order with your email and tracking ID.",
};

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-[#F9F6F2] py-16 md:py-24 text-center px-4">
        <p className="uppercase tracking-[4px] text-xs text-[#A37C43] mb-4">
          Orders
        </p>
        <h1 className="secHd">Track Order</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-xl mx-auto">
          Enter your email and order tracking ID to check the status of your
          order.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-15 md:px-10 md:py-20">
        <TrackOrderForm />
      </section>
    </div>
  );
}
