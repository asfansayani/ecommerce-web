import { Pagination } from "@/types/common";
import { getTranslation } from "@/lib/helpers/getTranslation";

export type OrderStatus =
  | "unpaid"
  | "pending_confirmation"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded";

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: string;
  image: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  items: OrderItem[];
  totalItems: number;
  totalAmount: string;
};

export type OrderDetail = Order & {
  placedOn: string;
  subtotal: string;
  vat: string;
  shippingFee: string;
  paymentMethod: string;
  customerName: string;
  mobileNumber: string;
  address: string;
  trackingId?: string;
  invoiceUrl?: string;
  canCancel: boolean;
};

export type ApiOrderItem = {
  id?: number | string;
  name?: string;
  productName?: string;
  title?: string;
  quantity?: number;
  qty?: number;
  price?: string | number;
  unitPrice?: string | number;
  finalAmountPerUnit?: string | number;
  lineSubtotal?: string | number;
  image?: string;
  productImage?: string;
  productImageUrls?: string[];
  translations?: {
    id?: number;
    name?: string;
    description?: string;
    language: string;
    orderItemId?: number;
  }[];
  product?: {
    id?: number | string;
    name?: string;
    image?: string;
    price?: string | number;
    translations?: { name?: string; language: string }[];
  };
};

export type ApiOrder = {
  id?: number | string;
  orderNumber?: string;
  order_number?: string;
  orderCode?: string;
  status?: string;
  totalAmount?: string | number;
  total?: string | number;
  grandTotal?: string | number;
  amount?: string | number;
  subtotal?: string | number;
  subTotal?: string | number;
  vat?: string | number;
  tax?: string | number;
  vatPercentage?: string | number;
  shippingFee?: string | number;
  shipping?: string | number;
  shippingCost?: string | number;
  paymentMethod?: string;
  payment_method?: string;
  placedOn?: string;
  createdAt?: string;
  created_at?: string;
  invoiceUrl?: string;
  invoice_url?: string;
  orderTrackingId?: string | null;
  canCancel?: boolean;
  totalItems?: number;
  itemCount?: number;
  items?: ApiOrderItem[];
  orderItems?: ApiOrderItem[];
  products?: ApiOrderItem[];
  customerName?: string;
  customer_name?: string;
  mobileNumber?: string;
  mobile_number?: string;
  phone?: string;
  address?: string;
  shippingAddress?:
    | string
    | {
        name?: string;
        fullName?: string;
        firstName?: string;
        lastName?: string;
        phone?: string;
        mobile?: string;
        address?: string;
        fullAddress?: string;
        street?: string;
        city?: string;
        country?: string;
      };
  delivery?: {
    name?: string;
    phone?: string;
    address?: string;
  };
  user?: {
    name?: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
};

export type OrdersResponse = {
  data: ApiOrder[];
  meta?: Pagination;
};

export type OrderDetailResponse = {
  data: ApiOrder;
};

export type TrackOrderPayload = {
  email: string;
  orderTrackingId: string;
};

export type TrackOrderResponse = {
  message?: string;
  success?: boolean;
  data?: ApiOrder;
};

export type CreateOrderAddress = {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2?: string;
  country: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
};

export type CreateOrderCartItem = {
  productId: number;
  quantity: number;
  selections?: {
    variantId: number;
    variantValueId: number;
  }[];
};

/** Online card payment — gateway returns a redirect URL */
export type CreateOrderPaymentMethod = "PAYMENNT" | "CASH_ON_DELIVERY";

export type CreateOrderPayload = {
  shippingAddress: CreateOrderAddress;
  billingAddress?: CreateOrderAddress;
  isBillingAddSameAsShippingAdd: boolean;
  notes?: string;
  email: string;
  cartItems: CreateOrderCartItem[];
  paymentMethod: CreateOrderPaymentMethod;
  couponCode?: string;
};

export type CreateOrderResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: {
    id?: number | string;
    orderNumber?: string;
    url?: string;
    paymentUrl?: string;
    redirectUrl?: string;
    paymentLink?: string;
    checkoutUrl?: string;
    payment?: {
      url?: string;
      paymentUrl?: string;
      redirectUrl?: string;
    };
    [key: string]: unknown;
  };
  meta?: {
    url?: string;
    paymentUrl?: string;
    redirectUrl?: string;
    [key: string]: unknown;
  };
};

/** Pull payment redirect URL from common response shapes */
export function extractOrderPaymentUrl(
  response: CreateOrderResponse
): string | null {
  const preferred: unknown[] = [
    response.data?.url,
    response.data?.paymentUrl,
    response.data?.redirectUrl,
    response.data?.paymentLink,
    response.data?.checkoutUrl,
    response.data?.payment?.url,
    response.data?.payment?.paymentUrl,
    response.data?.payment?.redirectUrl,
    response.meta?.url,
    response.meta?.paymentUrl,
    response.meta?.redirectUrl,
  ];

  for (const value of preferred) {
    if (typeof value === "string" && /^https?:\/\//i.test(value.trim())) {
      return value.trim();
    }
  }

  // Fallback: key names that look like payment / redirect URLs
  const stack: Array<Record<string, unknown>> = [];
  if (response.data && typeof response.data === "object") {
    stack.push(response.data as Record<string, unknown>);
  }
  if (response.meta && typeof response.meta === "object") {
    stack.push(response.meta as Record<string, unknown>);
  }

  while (stack.length) {
    const current = stack.pop()!;
    for (const [key, value] of Object.entries(current)) {
      if (value && typeof value === "object" && !Array.isArray(value)) {
        stack.push(value as Record<string, unknown>);
        continue;
      }
      if (typeof value !== "string") continue;
      const looksLikePaymentKey =
        /url|link|redirect|checkout|payment/i.test(key);
      if (looksLikePaymentKey && /^https?:\/\//i.test(value.trim())) {
        return value.trim();
      }
    }
  }

  return null;
}

const STATUS_MAP: Record<string, OrderStatus> = {
  unpaid: "unpaid",
  paid: "processing",
  pending_confirmation: "pending_confirmation",
  pendingconfirmation: "pending_confirmation",
  "pending confirmation": "pending_confirmation",
  pending: "pending_confirmation",
  processing: "processing",
  shipped: "shipped",
  delivered: "delivered",
  cancelled: "cancelled",
  canceled: "cancelled",
  refunded: "refunded",
};

function toMoney(value: string | number | undefined) {
  if (value === undefined || value === null || value === "") return "0.00";
  const num = typeof value === "number" ? value : Number(value);
  if (Number.isFinite(num)) return num.toFixed(2);
  return String(value);
}

function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export function normalizeStatus(status?: string): OrderStatus {
  if (!status) return "processing";
  const key = status
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
  const compact = key.replace(/\s+/g, "");
  return (
    STATUS_MAP[key] ||
    STATUS_MAP[compact] ||
    STATUS_MAP[status.trim().toLowerCase()] ||
    "processing"
  );
}

function normalizeItem(
  item: ApiOrderItem,
  index: number,
  locale = "en"
): OrderItem {
  const product = item.product;
  const itemTranslation = getTranslation(item.translations, locale);
  const productTranslation = getTranslation(product?.translations, locale);

  return {
    id: Number(item.id ?? product?.id ?? index + 1),
    name:
      itemTranslation?.name ||
      item.name ||
      item.productName ||
      item.title ||
      productTranslation?.name ||
      product?.name ||
      "Product",
    quantity: Number(item.quantity ?? item.qty ?? 1),
    price: toMoney(
      item.finalAmountPerUnit ??
        item.unitPrice ??
        item.price ??
        product?.price
    ),
    image:
      item.productImageUrls?.[0] ||
      item.image ||
      item.productImage ||
      product?.image ||
      "/assets/images/productImage.svg",
  };
}

function resolveAddress(order: ApiOrder) {
  const shipping = order.shippingAddress;
  if (typeof shipping === "string" && shipping.trim()) return shipping;
  if (shipping && typeof shipping === "object") {
    return (
      shipping.fullAddress ||
      shipping.address ||
      [shipping.street, shipping.city, shipping.country].filter(Boolean).join(", ") ||
      ""
    );
  }
  return order.address || order.delivery?.address || "";
}

function resolveCustomerName(order: ApiOrder) {
  if (order.customerName || order.customer_name) {
    return order.customerName || order.customer_name || "";
  }
  if (typeof order.shippingAddress === "object") {
    return (
      order.shippingAddress?.firstName + " " + order.shippingAddress?.lastName || ""
    );
  }
  if (order.delivery?.name) return order.delivery.name;
  if (order.user?.name) return order.user.name;
  if (order.user?.firstName || order.user?.lastName) {
    return [order.user.firstName, order.user.lastName].filter(Boolean).join(" ");
  }
  return "";
}

function resolveMobile(order: ApiOrder) {
  if (order.mobileNumber || order.mobile_number || order.phone) {
    return order.mobileNumber || order.mobile_number || order.phone || "";
  }
  if (typeof order.shippingAddress === "object") {
    return order.shippingAddress?.phone || order.shippingAddress?.mobile || "";
  }
  return order.delivery?.phone || order.user?.phone || "";
}

function resolveOrderNumber(order: ApiOrder) {
  const raw =
    order.orderNumber ??
    order.order_number ??
    order.orderCode ??
    order.id ??
    "";
  const value = String(raw);
  if (!value) return "BIJOU-";
  if (/^bijou/i.test(value)) return value.toUpperCase().replace(/\s+/g, "");
  return `BIJOU-${value}`;
}

export function normalizeOrder(order: ApiOrder, locale = "en"): Order {
  const rawItems = order.items ?? order.orderItems ?? order.products ?? [];
  const items = rawItems.map((item, index) =>
    normalizeItem(item, index, locale)
  );
  const totalItems =
    order.totalItems ??
    order.itemCount ??
    items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: String(order.id ?? ""),
    orderNumber: resolveOrderNumber(order),
    status: normalizeStatus(order.status),
    items,
    totalItems,
    totalAmount: toMoney(
      order.totalAmount ?? order.grandTotal ?? order.total ?? order.amount,
    ),
  };
}

export function normalizeOrderDetail(
  order: ApiOrder,
  locale = "en"
): OrderDetail {
  const base = normalizeOrder(order, locale);
  const vatValue = order.vat ?? order.tax ?? order.vatPercentage;
  const vat =
    typeof vatValue === "number" ||
    (typeof vatValue === "string" && !vatValue.includes("%") && !Number.isNaN(Number(vatValue)))
      ? `${vatValue}%`
      : String(vatValue ?? "5%");

  return {
    ...base,
    placedOn: formatDate(order.placedOn ?? order.createdAt ?? order.created_at),
    subtotal: toMoney(order.subtotal ?? order.subTotal),
    vat,
    shippingFee: toMoney(
      order.shippingFee ?? order.shipping ?? order.shippingCost,
    ),
    paymentMethod:
      order.paymentMethod ||
      order.payment_method ||
      "Credit / Debit Card",
    customerName: resolveCustomerName(order) || "-",
    mobileNumber: resolveMobile(order) || "-",
    address: resolveAddress(order) || "-",
    trackingId:
      order.orderTrackingId ||
      undefined,
    invoiceUrl: order.invoiceUrl || order.invoice_url,
    canCancel:
      order.canCancel ??
      !["cancelled", "delivered", "refunded", "shipped"].includes(base.status),
  };
}
