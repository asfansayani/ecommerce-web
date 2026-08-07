export type CheckoutAddressFields = {
  firstName: string;
  lastName: string;
  addressLine1: string;
  addressLine2: string;
  country: string;
  city: string;
  postalCode: string;
  phone: string;
  email: string;
};

export type GuestCheckoutAddresses = {
  shipping: CheckoutAddressFields;
  billing: CheckoutAddressFields | null;
  useDifferentBilling: boolean;
};

export type CheckoutMeta = {
  email: string;
  note: string;
};

const GUEST_ADDRESSES_KEY = "bijou-guest-checkout-addresses";
const CHECKOUT_META_KEY = "bijou-checkout-meta";

export const emptyAddressFields = (): CheckoutAddressFields => ({
  firstName: "",
  lastName: "",
  addressLine1: "",
  addressLine2: "",
  country: "",
  city: "",
  postalCode: "",
  phone: "",
  email: "",
});

function canUseStorage() {
  return typeof window !== "undefined";
}

export function getCheckoutMeta(): CheckoutMeta | null {
  if (!canUseStorage()) return null;
  try {
    const raw = sessionStorage.getItem(CHECKOUT_META_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CheckoutMeta;
  } catch {
    return null;
  }
}

export function setCheckoutMeta(meta: CheckoutMeta) {
  if (!canUseStorage()) return;
  sessionStorage.setItem(CHECKOUT_META_KEY, JSON.stringify(meta));
}

export function getGuestCheckoutAddresses(): GuestCheckoutAddresses | null {
  if (!canUseStorage()) return null;
  try {
    const raw = localStorage.getItem(GUEST_ADDRESSES_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as {
      shipping?: Partial<CheckoutAddressFields>;
      billing?: Partial<CheckoutAddressFields> | null;
      useDifferentBilling?: boolean;
    };
    if (!parsed.shipping) return null;
    return {
      shipping: {
        ...emptyAddressFields(),
        ...parsed.shipping,
        postalCode: parsed.shipping.postalCode ?? "",
      },
      billing: parsed.billing
        ? {
            ...emptyAddressFields(),
            ...parsed.billing,
            postalCode: parsed.billing.postalCode ?? "",
          }
        : null,
      useDifferentBilling: parsed.useDifferentBilling ?? false,
    };
  } catch {
    return null;
  }
}

export function setGuestCheckoutAddresses(data: GuestCheckoutAddresses) {
  if (!canUseStorage()) return;
  localStorage.setItem(GUEST_ADDRESSES_KEY, JSON.stringify(data));
}
