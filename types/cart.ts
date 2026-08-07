export type CartVariantSelection = {
  variantId: number;
  variantName: string;
  valueId: number;
  valueName: string;
  colorCode?: string | null;
};

export type CartItem = {
  /** Unique line id: product + sku/variants so different options stay separate */
  cartKey: string;
  productId: number;
  productSkuId?: number | null;
  name: string;
  slug?: string | null;
  price: string;
  image: string;
  quantity: number;
  variants?: CartVariantSelection[];
};

export type ValidateCartSelectionPayload = {
  variantId: number;
  variantValueId: number;
};

export type ValidateCartItemPayload = {
  productId: number;
  quantity: number;
  selections: ValidateCartSelectionPayload[];
};

export type ValidateCartItemsPayload = {
  cartItems: ValidateCartItemPayload[];
};

export type ValidateCartSelectionResult = {
  variantId: number;
  variantValueId: number;
  valid: boolean;
};

export type ValidateCartItemResult = {
  productId: number;
  quantity: number;
  comingSoon: boolean;
  inStock: boolean;
  valid: boolean;
  selections: ValidateCartSelectionResult[];
};

export type ValidateCartItemsData = {
  status: boolean;
  message: string;
  cartItems: ValidateCartItemResult[];
  invalidProducts: number[];
  invalidSelections: unknown[];
};

export type ValidateCartItemsResponse = {
  success?: boolean;
  statusCode?: number;
  message?: string;
  data?: ValidateCartItemsData;
};
