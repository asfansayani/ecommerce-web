import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Order } from "@/types/order";
import OrderStatusBadge from "./OrderStatusBadge";

export default function OrderCard({ order }: { order: Order }) {
  const previewItem = order.items[0];

  return (
    <article className="rounded-lg border border-border bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-boska-medium text-xl text-primary md:text-2xl">
          Order # {order.orderNumber}
        </h2>
        <OrderStatusBadge status={order.status} />
      </div>

      {previewItem ? (
        <div className="mt-5 flex items-start gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-[#F9F6F2] md:size-20">
            <Image
              src={previewItem.image || "/assets/images/productImage.svg"}
              alt={previewItem.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="text-sm font-semibold text-primary md:text-base">
                  {previewItem.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Quantity: {previewItem.quantity}
                </p>
              </div>
              <p className="shrink-0 text-sm text-primary md:text-base">
                AED {previewItem.price}
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-5 flex flex-col gap-4 border-t border-dashed border-border pt-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs text-gray-500">
            Total ({order.totalItems} Item{order.totalItems === 1 ? "" : "s"})
          </p>
          <p className="mt-1 text-sm font-semibold text-primary md:text-base">
            AED {order.totalAmount}
          </p>
        </div>

        <Button
          size="default"
          className="h-10 gap-2 rounded-md px-4 font-boska-medium uppercase tracking-[1px]"
          nativeButton={false}
          render={<Link href={`/orders/${order.id}`} />}
        >
          Track Order
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Button>
      </div>
    </article>
  );
}
