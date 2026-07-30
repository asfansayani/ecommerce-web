import type { Metadata } from "next";
import PaginationControls from "@/components/dashboard/PaginationControls";
import { getOrders } from "@/lib/api/orders";
import {
  ORDER_STATUS_FILTERS,
  type OrderStatusFilter,
} from "@/lib/data/orders";
import { normalizeOrder, type Order } from "@/types/order";
import OrderCard from "./OrderCard";
import OrderStatusTabs from "./OrderStatusTabs";

export const metadata: Metadata = {
  title: "Order History – Bijou Sky",
  description: "View and track your Bijou Sky orders.",
};

const PAGE_SIZE = 3;

type OrdersPageProps = {
  searchParams: Promise<{ status?: string; page?: string }>;
};

function isOrderStatusFilter(value: string): value is OrderStatusFilter {
  return ORDER_STATUS_FILTERS.some((filter) => filter.value === value);
}

function buildOrdersBasePath(status: OrderStatusFilter) {
  return status === "all" ? "/orders" : `/orders?status=${status}`;
}

export default async function OrdersPage({ searchParams }: OrdersPageProps) {
  const { status, page: pageParam } = await searchParams;
  const activeStatus: OrderStatusFilter =
    status && isOrderStatusFilter(status) ? status : "all";
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  let orders: Order[] = [];
  let totalPages = 1;
  let currentPage = requestedPage;
  let hasError = false;

  try {
    const query: Record<string, string | number | boolean> = {
      page: requestedPage,
      limit: PAGE_SIZE,
    };

    if (activeStatus !== "all") {
      query.status = activeStatus;
    }

    const response = await getOrders(query);
    orders = (response?.data ?? []).map(normalizeOrder);
    totalPages = Math.max(1, response?.meta?.totalPages ?? 1);
    currentPage = response?.meta?.page ?? requestedPage;
  } catch {
    hasError = true;
  }

  const basePath = buildOrdersBasePath(activeStatus);

  return (
    <div className="min-h-full">
      <div className="border-b border-border bg-[#F9F6F2] px-6 py-8 md:px-10 md:py-10">
        <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
          Account
        </p>
        <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
          Order History
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500">
          View and track your past and current orders.
        </p>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-12">
        <OrderStatusTabs activeStatus={activeStatus} />

        <div className="mt-6 flex flex-col gap-4 md:mt-8 md:gap-5">
          {hasError ? (
            <p className="rounded-lg border border-border bg-white p-6 text-sm text-gray-500">
              Unable to load orders right now. Please try again later.
            </p>
          ) : orders.length === 0 ? (
            <p className="rounded-lg border border-border bg-white p-6 text-sm text-gray-500">
              No orders found for this status.
            </p>
          ) : (
            <>
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}

              <div className="pt-2">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={basePath}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
