import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const statusStyles: Record<
  OrderStatus,
  { label: string; className: string }
> = {
  unpaid: {
    label: "Unpaid",
    className: "bg-amber-50 text-amber-700",
  },
  pending_confirmation: {
    label: "Pending Confirmation",
    className: "bg-orange-50 text-orange-700",
  },
  processing: {
    label: "Processing",
    className: "bg-sky-50 text-sky-700",
  },
  shipped: {
    label: "Shipped",
    className: "bg-indigo-50 text-indigo-700",
  },
  delivered: {
    label: "Delivered",
    className: "bg-emerald-50 text-emerald-700",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-rose-50 text-rose-700",
  },
  refunded: {
    label: "Refunded",
    className: "bg-violet-50 text-violet-700",
  },
};

export default function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const style = statusStyles[status];

  return (
    <Badge
      variant="secondary"
      className={cn(
        "rounded-md px-4 py-4 text-[10px] font-semibold uppercase tracking-[1px]",
        style.className,
      )}
    >
      {style.label}
    </Badge>
  );
}
