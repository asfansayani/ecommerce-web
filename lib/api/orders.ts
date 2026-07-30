import { fetcher } from "@/lib/fetcher";
import type { OrderDetailResponse, OrdersResponse } from "@/types/order";

export const getOrders = async (
  query?: Record<string, string | number | boolean>
): Promise<OrdersResponse> => {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/user/orders`, query);
};

export const getOrderById = async (
  id: string | number
): Promise<OrderDetailResponse> => {
  return fetcher(`${process.env.NEXT_PUBLIC_API_URL}/user/orders/${id}`);
};
