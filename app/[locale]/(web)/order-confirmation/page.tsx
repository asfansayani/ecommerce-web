import type { Metadata } from "next";
import {
  ArrowRight,
  Check,
  Mail,
  Truck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type OrderConfirmationPageProps = {
  searchParams: Promise<{ success?: string }>;
};

export async function generateMetadata({
  searchParams,
}: OrderConfirmationPageProps): Promise<Metadata> {
  const { success } = await searchParams;
  const isSuccess = success === "true";

  return {
    title: isSuccess
      ? "Order Confirmed – Bijou Sky"
      : "Payment Failed – Bijou Sky",
    description: isSuccess
      ? "Thank you for your order. Your payment was successful."
      : "Your payment could not be processed. Please try again.",
  };
}

export default async function OrderConfirmationPage({
  searchParams,
}: OrderConfirmationPageProps) {
  const { success } = await searchParams;
  const isSuccess = success === "true";

  return (
    <div
      className="min-h-[70vh]"
      style={{
        background:
          "radial-gradient(ellipse 80% 70% at 50% 35%, #F5EFE6 0%, #FCFAF7 45%, #FFFFFF 100%)",
      }}
    >
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center md:py-24">
        {/* Status icon */}
        <div
          className={`mb-8 flex size-20 items-center justify-center rounded-full border md:size-24 ${
            isSuccess
              ? "border-tertiary/25 bg-white text-tertiary shadow-[0_0_0_8px_rgba(109,73,23,0.04)]"
              : "border-red-200 bg-white text-red-600 shadow-[0_0_0_8px_rgba(220,38,38,0.04)]"
          }`}
        >
          {isSuccess ? (
            <Check className="size-9 md:size-10" strokeWidth={1.75} />
          ) : (
            <X className="size-9 md:size-10" strokeWidth={1.75} />
          )}
        </div>

        {/* Label */}
        <p
          className={`mb-4 text-[11px] font-medium uppercase tracking-[0.25em] md:text-xs ${
            isSuccess ? "text-quaternary" : "text-red-500"
          }`}
        >
          {isSuccess ? "Order Confirmed" : "Payment Failed"}
        </p>

        {/* Heading */}
        <h1 className="font-boska-bold text-[32px] leading-[1.15] text-primary md:text-5xl">
          {isSuccess ? "Thank You For Your Order" : "Payment Unsuccessful"}
        </h1>

        {/* Subtext */}
        <p className="mt-5 max-w-md text-sm leading-relaxed text-gray-500 md:text-[15px]">
          {isSuccess
            ? "Your order has been placed successfully. A confirmation email has been sent with your order details."
            : "Something went wrong while processing your payment. No charges were made — please try again."}
        </p>

        {/* Info grid */}
        {isSuccess ? (
          <div className="mt-12 grid w-full max-w-lg grid-cols-1 gap-8 sm:grid-cols-2 sm:gap-0">
            <div className="flex flex-col items-center sm:border-e sm:border-black/10 sm:px-8">
              <Mail
                className="mb-3 size-5 text-primary/70"
                strokeWidth={1.5}
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Email Receipt
              </p>
              <p className="mt-2 text-sm text-gray-500">
                Check your inbox for order details
              </p>
            </div>

            <div className="flex flex-col items-center sm:px-8">
              <Truck
                className="mb-3 size-5 text-primary/70"
                strokeWidth={1.5}
              />
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                We Are Packing
              </p>
              <p className="mt-2 text-sm text-gray-500">
                We&apos;ll notify you when it ships
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-12 max-w-md text-sm leading-relaxed text-gray-500">
            If an amount was deducted from your account, it will be refunded
            within 3–5 business days. Need help? Contact our support team.
          </div>
        )}

        {/* Actions */}
        <div className="mt-12 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/" />}
            className="h-12 w-full rounded-md border-primary/80 bg-transparent px-7 text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary/5 sm:w-auto"
          >
            Continue Shopping
          </Button>

          {isSuccess ? (
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/track-order" />}
              className="h-12 w-full rounded-md bg-tertiary px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-tertiary/90 sm:w-auto"
            >
              Track My Order
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          ) : (
            <Button
              size="lg"
              nativeButton={false}
              render={<Link href="/contact-us" />}
              className="h-12 w-full rounded-md bg-tertiary px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-tertiary/90 sm:w-auto"
            >
              Contact Support
              <ArrowRight className="size-4" data-icon="inline-end" />
            </Button>
          )}
        </div>
      </section>
    </div>
  );
}
