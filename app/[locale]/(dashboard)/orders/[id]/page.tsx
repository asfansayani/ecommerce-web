import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/api/orders";
import { normalizeOrderDetail } from "@/types/order";
import DeliveryInformationCard from "./DeliveryInformationCard";
import DownloadInvoiceButton from "./DownloadInvoiceButton";
import OrderDetailProducts from "./OrderDetailProducts";
import OrderStatusStepper from "./OrderStatusStepper";
import OrderSummaryCard from "./OrderSummaryCard";

type OrderDetailPageProps = {
  params: Promise<{ id: string; locale: string }>;
};

export async function generateMetadata({
  params,
}: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order ${id} – Bijou Sky`,
    description: "View details for your Bijou Sky order.",
  };
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id, locale } = await params;

  let order = null;
  let hasError = false;

  try {
    const response = await getOrderById(id);
    if (!response?.data) {
      notFound();
    }
    order = normalizeOrderDetail(response.data, locale);
  } catch {
    hasError = true;
  }

  if (hasError || !order) {
    return (
      <div className="min-h-full">
        <div className="border-b border-border bg-[#F9F6F2] px-6 py-8 md:px-10 md:py-10">
          <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
            Account
          </p>
          <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
            Order Detail
          </h1>
        </div>
        <div className="px-6 py-8 md:px-10 md:py-12">
          <p className="rounded-lg border border-border bg-white p-6 text-sm text-gray-500">
            Unable to load this order right now. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="border-b border-border bg-[#F9F6F2] px-6 py-8 md:px-10 md:py-10">
        <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
          Account
        </p>
        <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
          Order Detail
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500">
          Track progress and review the details for {order.orderNumber}.
        </p>
      </div>

      <div className="flex max-w-5xl flex-col gap-6 px-6 py-8 md:gap-8 md:px-10 md:py-12">
        <OrderStatusStepper status={order.status} />

        <section>
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-boska-medium text-xl text-primary md:text-2xl">
              Products
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {order.canCancel ? (
                <Button
                  size="default"
                  className="h-10 rounded-md bg-destructive px-4 text-xs font-semibold uppercase tracking-[1px] text-white hover:bg-destructive/90"
                >
                  Cancel Order
                </Button>
              ) : null}
              <DownloadInvoiceButton orderId={order.id} />
            </div>
          </div>

          <OrderDetailProducts items={order.items} />
        </section>

        <OrderSummaryCard order={order} />
        <DeliveryInformationCard order={order} />
      </div>
    </div>
  );
}
