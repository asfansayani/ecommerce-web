export const ORDER_STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "unpaid", label: "Unpaid" },
  { value: "pending_confirmation", label: "Pending Confirmation" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
] as const;

export type OrderStatusFilter = (typeof ORDER_STATUS_FILTERS)[number]["value"];
