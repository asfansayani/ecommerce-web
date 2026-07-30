"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { trackOrder } from "@/lib/api/orders";
import {
  normalizeOrderDetail,
  type OrderDetail,
} from "@/types/order";
import { useLocale } from "next-intl";
import DeliveryInformationCard from "@/app/[locale]/(dashboard)/orders/[id]/DeliveryInformationCard";
import OrderDetailProducts from "@/app/[locale]/(dashboard)/orders/[id]/OrderDetailProducts";
import OrderStatusStepper from "@/app/[locale]/(dashboard)/orders/[id]/OrderStatusStepper";
import OrderSummaryCard from "@/app/[locale]/(dashboard)/orders/[id]/OrderSummaryCard";

type TrackOrderFormValues = {
  email: string;
  orderTrackingId: string;
};

export default function TrackOrderForm() {
  const locale = useLocale();
  const [trackedOrder, setTrackedOrder] = useState<OrderDetail | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TrackOrderFormValues>({
    defaultValues: {
      email: "",
      orderTrackingId: "",
    },
  });

  const onSubmit = async (data: TrackOrderFormValues) => {
    setTrackedOrder(null);
    try {
      const response = await trackOrder({
        email: data.email.trim(),
        orderTrackingId: data.orderTrackingId.trim(),
      });
      toast.success(response.message || "Order found successfully");

      if (response.data) {
        setTrackedOrder(normalizeOrderDetail(response.data, locale));
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to track this order";
      toast.error(message);
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 md:gap-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mx-auto flex w-full max-w-xl flex-col gap-5 rounded-lg border border-border bg-white p-6 md:p-8"
        noValidate
      >
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email",
            },
          })}
        />

        <FormField
          label="Order Tracking ID"
          placeholder="Enter your tracking ID"
          autoComplete="off"
          error={errors.orderTrackingId?.message}
          {...register("orderTrackingId", {
            required: "Order tracking ID is required",
            minLength: {
              value: 3,
              message: "Please enter a valid tracking ID",
            },
          })}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Tracking..." : "Track Order"}
        </Button>
      </form>

      {trackedOrder ? (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 md:gap-8">
          <OrderStatusStepper status={trackedOrder.status} />

          <section>
            <div className="mb-4">
              <h2 className="font-boska-medium text-xl text-primary md:text-2xl">
                Products
              </h2>
            </div>
            <OrderDetailProducts items={trackedOrder.items} />
          </section>

          <OrderSummaryCard order={trackedOrder} />
          <DeliveryInformationCard order={trackedOrder} />
        </div>
      ) : null}
    </div>
  );
}
