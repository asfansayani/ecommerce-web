import type { OrderDetail } from "@/types/order";
import OrderStatusBadge from "../OrderStatusBadge";

function SummaryRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className={bold ? "font-semibold text-primary" : "text-gray-500"}>
        {label}
      </span>
      <span
        className={
          bold
            ? "text-end font-semibold text-primary"
            : "text-end text-primary"
        }
      >
        {value}
      </span>
    </div>
  );
}

export default function OrderSummaryCard({ order }: { order: OrderDetail }) {
  return (
    <section className="rounded-lg border border-border bg-white p-5 md:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="font-boska-medium text-xl text-primary md:text-2xl">
          Order Summary
        </h2>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="mt-4 divide-y divide-border">
        <SummaryRow label="Order No." value={order.orderNumber} />
        <SummaryRow label="Placed on" value={order.placedOn} />
        <SummaryRow label="Subtotal" value={`AED ${order.subtotal}`} />
        <SummaryRow label="VAT" value={order.vat} />
        <SummaryRow label="Shipping Fee" value={`AED ${order.shippingFee}`} />
        <SummaryRow label="Payment Method" value={order.paymentMethod} />
        <SummaryRow label="Total" value={`AED ${order.totalAmount}`} bold />
      </div>
    </section>
  );
}
