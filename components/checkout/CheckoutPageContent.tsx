"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import CheckoutAddressFields, {
  type CheckoutAddressFormGroup,
} from "@/components/checkout/CheckoutAddressFields";
import AddressSelectCard from "@/components/checkout/AddressSelectCard";
import CheckoutOrderSummary from "@/components/checkout/CheckoutOrderSummary";
import { useCheckoutPromo } from "@/components/checkout/useCheckoutPromo";
import ProductsNotFound from "@/components/common/ProductsNotFound";
import { Link } from "@/i18n/navigation";
import { getAddresses } from "@/lib/api/address";
import { createOrder } from "@/lib/api/orders";
import { buildCreateOrderPayload } from "@/lib/checkout-order";
import {
  emptyAddressFields,
  getCheckoutMeta,
  getGuestCheckoutAddresses,
  setGuestCheckoutAddresses,
} from "@/lib/checkout-storage";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import type { Address } from "@/types/address";
import { extractOrderPaymentUrl } from "@/types/order";
import { cn } from "@/lib/utils";

type LoggedInCheckoutForm = {
  shippingAddressId: number | null;
};

export default function CheckoutPageContent() {
  const token = useAuthStore((s) => s.token);
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState("");
  const [checkoutNote, setCheckoutNote] = useState("");

  useEffect(() => {
    setMounted(true);
    const meta = getCheckoutMeta();
    if (meta) {
      setCheckoutEmail(meta.email);
      setCheckoutNote(meta.note);
    }
  }, []);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading checkout…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <ProductsNotFound
        title="Nothing to Checkout"
        description="Your cart is empty. Add pieces you love, then return to checkout."
      />
    );
  }

  return (
    <div className="space-y-4">
      {(checkoutEmail || checkoutNote) && (
        <div className="rounded-lg border border-border bg-white px-4 py-3 text-sm text-gray-600 md:px-5">
          {checkoutEmail ? (
            <p>
              <span className="text-gray-500">Order email: </span>
              <span className="text-primary">{checkoutEmail}</span>
            </p>
          ) : null}
          {checkoutNote ? (
            <p className={cn(checkoutEmail && "mt-1")}>
              <span className="text-gray-500">Note: </span>
              <span className="text-primary">{checkoutNote}</span>
            </p>
          ) : null}
        </div>
      )}

      {token ? (
        <LoggedInCheckout
          orderEmail={checkoutEmail}
          orderNote={checkoutNote}
        />
      ) : (
        <GuestCheckout orderEmail={checkoutEmail} orderNote={checkoutNote} />
      )}
    </div>
  );
}

function GuestCheckout({
  orderEmail,
  orderNote,
}: {
  orderEmail: string;
  orderNote: string;
}) {
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const token = useAuthStore((s) => s.token);
  const saved = getGuestCheckoutAddresses();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutAddressFormGroup>({
    defaultValues: {
      shipping: {
        ...emptyAddressFields(),
        ...saved?.shipping,
        email: saved?.shipping?.email || orderEmail || "",
        postalCode: saved?.shipping?.postalCode || "",
      },
      billing: emptyAddressFields(),
      useDifferentBilling: false,
    },
  });

  const shippingEmail = watch("shipping.email");
  const resolveEmail = () => orderEmail || shippingEmail || "";
  const promo = useCheckoutPromo(resolveEmail);

  const onSubmit = async (data: CheckoutAddressFormGroup) => {
    setGuestCheckoutAddresses({
      shipping: data.shipping,
      billing: null,
      useDifferentBilling: false,
    });

    try {
      const payload = buildCreateOrderPayload({
        shipping: data.shipping,
        email: orderEmail || data.shipping.email,
        notes: orderNote,
        items,
        couponCode: promo.appliedCoupon?.code,
      });

      const response = await createOrder(payload, token);
      const paymentUrl = extractOrderPaymentUrl(response);

      if (!paymentUrl) {
        toast.error(
          response.message ||
            "Order created but payment link is missing. Please contact support.",
        );
        return;
      }

      clearCart();
      toast.success(response.message || "Redirecting to payment…");
      window.location.href = paymentUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to place order";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10"
      noValidate
    >
      <div className="flex flex-col gap-6 lg:col-span-8">
        <section className="rounded-lg border border-border bg-white p-4 md:p-6">
          <h2 className="font-boska-medium text-lg text-primary md:text-xl">
            Shipping Address
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Where should we deliver your order?
          </p>
          <div className="mt-5">
            <CheckoutAddressFields
              namePrefix="shipping"
              register={register}
              control={control}
              setValue={setValue}
              watch={watch}
              errors={errors}
            />
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 lg:col-span-4">
        <CheckoutOrderSummary
          promoCode={promo.promoCode}
          onPromoCodeChange={promo.onPromoCodeChange}
          onApplyPromo={promo.onApplyPromo}
          onRemovePromo={promo.onRemovePromo}
          appliedCoupon={promo.appliedCoupon}
          isApplyingPromo={promo.isApplyingPromo}
          isSubmitting={isSubmitting}
        />
      </aside>
    </form>
  );
}

function LoggedInCheckout({
  orderEmail,
  orderNote,
}: {
  orderEmail: string;
  orderNote: string;
}) {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useForm<LoggedInCheckoutForm>({
    defaultValues: {
      shippingAddressId: null,
    },
  });

  const shippingAddressId = watch("shippingAddressId");

  const selectedShipping = addresses.find((a) => a.id === shippingAddressId);
  const resolveEmail = () =>
    orderEmail || selectedShipping?.email || user?.email || "";
  const promo = useCheckoutPromo(resolveEmail);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setLoadError(false);
      try {
        const response = await getAddresses({ page: 1, limit: 50 });
        if (cancelled) return;
        const list = response?.data ?? [];
        setAddresses(list);
        const defaultAddress =
          list.find((a) => a.isDefault) ?? list[0] ?? null;
        if (defaultAddress) {
          setValue("shippingAddressId", defaultAddress.id);
        }
      } catch {
        if (!cancelled) setLoadError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [setValue]);

  const onSubmit = async (data: LoggedInCheckoutForm) => {
    if (!data.shippingAddressId) {
      toast.error("Please select a shipping address");
      return;
    }

    const shipping = addresses.find((a) => a.id === data.shippingAddressId);
    if (!shipping) {
      toast.error("Please select a valid shipping address");
      return;
    }

    try {
      const payload = buildCreateOrderPayload({
        shipping,
        email: orderEmail || shipping.email || user?.email || "",
        notes: orderNote,
        items,
        couponCode: promo.appliedCoupon?.code,
      });

      const response = await createOrder(payload, token);
      const paymentUrl = extractOrderPaymentUrl(response);

      if (!paymentUrl) {
        toast.error(
          response.message ||
            "Order created but payment link is missing. Please contact support.",
        );
        return;
      }

      clearCart();
      toast.success(response.message || "Redirecting to payment…");
      window.location.href = paymentUrl;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to place order";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10"
      noValidate
    >
      <div className="flex flex-col gap-6 lg:col-span-8">
        <section className="rounded-lg border border-border bg-white p-4 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-boska-medium text-lg text-primary md:text-xl">
                Shipping Address
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose a saved address for delivery.
              </p>
            </div>
            <Link
              href="/address/new"
              className="text-xs font-semibold uppercase tracking-[0.1em] text-tertiary hover:underline"
            >
              Add new
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {loading ? (
              <p className="text-sm text-gray-500">Loading addresses…</p>
            ) : loadError ? (
              <p className="text-sm text-red-600">
                Unable to load addresses. Please try again.
              </p>
            ) : addresses.length === 0 ? (
              <p className="rounded-md border border-dashed border-border p-4 text-sm text-gray-500">
                No saved addresses yet.{" "}
                <Link href="/address/new" className="text-tertiary underline">
                  Add an address
                </Link>{" "}
                to continue.
              </p>
            ) : (
              addresses.map((address) => (
                <AddressSelectCard
                  key={address.id}
                  address={address}
                  name="shippingAddress"
                  selected={shippingAddressId === address.id}
                  onSelect={() => setValue("shippingAddressId", address.id)}
                />
              ))
            )}
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 lg:col-span-4">
        <CheckoutOrderSummary
          promoCode={promo.promoCode}
          onPromoCodeChange={promo.onPromoCodeChange}
          onApplyPromo={promo.onApplyPromo}
          onRemovePromo={promo.onRemovePromo}
          appliedCoupon={promo.appliedCoupon}
          isApplyingPromo={promo.isApplyingPromo}
          isSubmitting={isSubmitting}
        />
      </aside>
    </form>
  );
}
