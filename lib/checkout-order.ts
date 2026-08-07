import type { CartItem } from "@/types/cart";
import type { Address } from "@/types/address";
import type { CheckoutAddressFields } from "@/lib/checkout-storage";
import type {
  CreateOrderAddress,
  CreateOrderCartItem,
  CreateOrderPayload,
} from "@/types/order";

export function toCreateOrderAddress(
  address: CheckoutAddressFields | Address
): CreateOrderAddress {
  return {
    firstName: address.firstName.trim(),
    lastName: address.lastName.trim(),
    addressLine1: address.addressLine1.trim(),
    addressLine2: address.addressLine2?.trim() || undefined,
    country: address.country.trim(),
    city: address.city.trim(),
    postalCode: (address.postalCode?.trim() || "00000"),
    phone: address.phone.trim(),
    email: address.email.trim(),
  };
}

export function toCreateOrderCartItems(items: CartItem[]): CreateOrderCartItem[] {
  return items.map((item) => {
    const cartItem: CreateOrderCartItem = {
      productId: item.productId,
      quantity: item.quantity,
    };

    if (item.variants?.length) {
      cartItem.selections = item.variants.map((variant) => ({
        variantId: variant.variantId,
        variantValueId: variant.valueId,
      }));
    }

    return cartItem;
  });
}

type BuildCreateOrderPayloadInput = {
  shipping: CheckoutAddressFields | Address;
  email: string;
  notes?: string;
  items: CartItem[];
  couponCode?: string | null;
};

export function buildCreateOrderPayload({
  shipping,
  email,
  notes,
  items,
  couponCode,
}: BuildCreateOrderPayloadInput): CreateOrderPayload {
  const shippingAddress = toCreateOrderAddress(shipping);
  const orderEmail = email.trim() || shippingAddress.email;

  const payload: CreateOrderPayload = {
    shippingAddress,
    isBillingAddSameAsShippingAdd: true,
    email: orderEmail,
    cartItems: toCreateOrderCartItems(items),
    // Card / online payment — response includes redirect URL
    paymentMethod: "PAYMENNT",
  };

  const trimmedNotes = notes?.trim();
  if (trimmedNotes) {
    payload.notes = trimmedNotes;
  }

  const code = couponCode?.trim();
  if (code) {
    payload.couponCode = code;
  }

  return payload;
}
