"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { MinusIcon, PlusIcon, Trash2 } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import ProductsNotFound from "@/components/common/ProductsNotFound";
import { validateCartItems } from "@/lib/api/orders";
import { setCheckoutMeta } from "@/lib/checkout-storage";
import { useCurrencyCode } from "@/hooks/useCurrencyCode";
import { useCartStore } from "@/store/cartStore";
import type { CartItem, ValidateCartItemResult } from "@/types/cart";
import { cn } from "@/lib/utils";


function formatMoney(value: number) {
  return value.toFixed(2);
}

function toValidatePayload(items: CartItem[]) {
  return {
    cartItems: items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      selections: (item.variants ?? []).map((variant) => ({
        variantId: variant.variantId,
        variantValueId: variant.valueId,
      })),
    })),
  };
}

function getInvalidReason(result?: ValidateCartItemResult) {
  if (!result || result.valid) return null;
  if (result.comingSoon) return "Coming soon";
  if (!result.inStock) return "Out of stock";
  if (result.selections?.some((s) => !s.valid)) {
    return "Selected options unavailable";
  }
  return "Unavailable";
}

type CartCheckoutFormValues = {
  email: string;
  note: string;
};

export default function CartPageContent() {
  const currency = useCurrencyCode();

  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const getSubtotal = useCartStore((s) => s.getSubtotal);
  const getTotalItems = useCartStore((s) => s.getTotalItems);
  const [mounted, setMounted] = useState(false);
  const [invalidByProductId, setInvalidByProductId] = useState<
    Record<number, ValidateCartItemResult>
  >({});

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CartCheckoutFormValues>({
    defaultValues: {
      email: "",
      note: "",
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setInvalidByProductId({});
  }, [items]);

  if (!mounted) {
    return (
      <div className="py-16 text-center text-sm text-gray-500">
        Loading your cart…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <ProductsNotFound
        title="Your Cart Is Empty"
        description="Looks like you haven't added any pieces yet. Explore the collection and find something you love."
      />
    );
  }

  const subtotal = getSubtotal();
  const totalItems = getTotalItems();

  const onSubmit = async (data: CartCheckoutFormValues) => {
    setInvalidByProductId({});

    try {
      const response = await validateCartItems(toValidatePayload(items));
      const result = response.data;

      if (!result?.status) {
        const map: Record<number, ValidateCartItemResult> = {};
        for (const cartItem of result?.cartItems ?? []) {
          if (!cartItem.valid) {
            map[cartItem.productId] = cartItem;
          }
        }
        setInvalidByProductId(map);
        toast.error(result?.message || "Some cart items are invalid.");
        return;
      }

      setCheckoutMeta({
        email: data.email.trim(),
        note: data.note.trim(),
      });
      router.push("/checkout");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to validate cart items";
      toast.error(message);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="relative grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10"
      noValidate
    >
      <div className="flex flex-col gap-6 lg:col-span-8">
        <section className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="border-b border-border px-4 py-3 md:px-5">
            <h2 className="font-boska-medium text-lg text-primary md:text-xl">
              Cart Items
            </h2>
          </div>

          <ul className="divide-y divide-border">
            {items.map((item) => {
              const lineTotal = Number(item.price) * item.quantity;
              const productSlug =
                item.slug || item.name.toLowerCase().replace(/ /g, "-");
              const href = `/products/${productSlug}?id=${item.productId}`;
              const variantsLabel = item.variants
                ?.map((v) => `${v.variantName}: ${v.valueName}`)
                .join(" · ");
              const invalidReason = getInvalidReason(
                invalidByProductId[item.productId],
              );
              const isInvalid = Boolean(invalidReason);

              return (
                <li
                  key={item.cartKey}
                  className={cn(
                    "p-4 md:p-5",
                    isInvalid && "bg-red-50/60",
                  )}
                >
                  <div className="flex gap-4">
                    <Link
                      href={href}
                      className={cn(
                        "relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-[#F9F6F2] md:h-32 md:w-28",
                        isInvalid && "opacity-70",
                      )}
                    >
                      <Image
                        src={item.image || "/assets/images/productImage.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </Link>

                    <div className="flex min-w-0 flex-1 flex-col gap-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <Link href={href}>
                            <h3 className="font-boska-medium text-base capitalize text-primary md:text-lg">
                              {item.name}
                            </h3>
                          </Link>
                          {variantsLabel ? (
                            <p className="mt-1 text-sm text-black/55">
                              {variantsLabel}
                            </p>
                          ) : null}
                          <p className="mt-1 text-sm text-tertiary">
                            {currency} {item.price}
                          </p>
                          {isInvalid ? (
                            <p className="mt-1 text-sm text-red-600" role="alert">
                              {invalidReason}
                            </p>
                          ) : null}
                        </div>

                        <p className="shrink-0 text-sm font-medium text-primary md:text-base">
                          {currency}{" "}
                          {formatMoney(
                            Number.isFinite(lineTotal) ? lineTotal : 0,
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center rounded-full bg-[#F0F0F0]">
                          <button
                            type="button"
                            aria-label="Decrease quantity"
                            className="p-2.5 md:p-3"
                            onClick={() =>
                              updateQuantity(item.cartKey, item.quantity - 1)
                            }
                          >
                            <MinusIcon className="size-4" />
                          </button>
                          <span className="min-w-6 text-center text-sm text-black/70">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            aria-label="Increase quantity"
                            className="p-2.5 md:p-3"
                            onClick={() =>
                              updateQuantity(item.cartKey, item.quantity + 1)
                            }
                          >
                            <PlusIcon className="size-4" />
                          </button>
                        </div>

                        <button
                          type="button"
                          aria-label={`Remove ${item.name} from cart`}
                          className="rounded-full p-2.5 text-gray-400 transition hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeItem(item.cartKey)}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-white p-4 md:p-5">
          <h2 className="font-boska-medium text-lg text-primary md:text-xl">
            Contact Details
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            We’ll use this email for order updates.
          </p>

          <div className="mt-5 flex flex-col gap-4">
            <FormField
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              required
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
              as="textarea"
              label="Note (optional)"
              placeholder="Add a note for your order…"
              rows={4}
              error={errors.note?.message}
              className="min-h-24"
              {...register("note")}
            />
          </div>
        </section>
      </div>

      <aside className="lg:sticky lg:top-6 lg:col-span-4">
        <div className="rounded-lg border border-border bg-white p-5 md:p-6">
          <h2 className="font-boska-medium text-xl text-primary md:text-2xl">
            Order Summary
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {totalItems} item{totalItems === 1 ? "" : "s"}
          </p>

          <div className="mt-5 divide-y divide-border border-t border-border">
            <div className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-primary">{currency} {formatMoney(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="text-right text-primary">
                Calculated at checkout
              </span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3 text-sm">
              <span className="font-semibold text-primary">Total</span>
              <span className="font-semibold text-primary">
                {currency} {formatMoney(subtotal)}
              </span>
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="mt-6 h-11 w-full rounded-md bg-tertiary text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-tertiary/90"
          >
            {isSubmitting ? "Validating…" : "Proceed to Checkout"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            nativeButton={false}
            render={<Link href="/shop/products" />}
            className="mt-3 h-11 w-full rounded-md border-primary/80 bg-transparent text-xs font-semibold uppercase tracking-[0.12em] text-primary hover:bg-primary/5"
          >
            Continue Shopping
          </Button>
        </div>
      </aside>
    </form>
  );
}
