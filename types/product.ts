import { Pagination, Translations } from "./common";
import { getTranslation } from "@/lib/helpers/getTranslation";

export type SpecialOffer = {
  id: number;
  name: string;
  discountPercent: string;
  createdAt?: string;
  updatedAt?: string;
  discountedPrice?: number | string;
};

export type ProductSkuInventory = {
  id?: number;
  productSkuId?: number;
  quantity?: number;
  reserved?: number;
  availableQuantity?: number;
};

export type ProductSku = {
  id: number;
  productId?: number;
  selectionKey?: string;
  skuCode?: string | null;
  price?: number | string | null;
  imageUrls?: string[];
  inventory?: ProductSkuInventory | null;
  values?: {
    id: number;
    variantValueId: number;
    variantId?: number;
  }[];
};

export type VariantValueOption = {
  id: number;
  variantValueId: number;
  imageUrls?: string[];
  variantValue?: {
    id: number;
    variantId?: number;
    translations?: Translations[];
  };
};

export type ProductVariant = {
  id: number;
  productId?: number;
  variantId?: number;
  variant?: {
    id: number;
    translations?: Translations[];
  };
  productVariantValues?: VariantValueOption[];
};

export type ProductFeature = {
  id: number;
  productId?: number;
  translations?: {
    id: number;
    language: string;
    text?: string;
    featureId?: number;
  }[];
};

export interface Product {
  id: number;
  image: string;
  name: string;
  description: string;
  price: string;
  slug?: string | null;
  translations: Translations[];
  isWishlisted: boolean;
  specialOffer: SpecialOffer | null;
}

export interface ApiProduct {
  id: number;
  slug?: string | null;
  price?: number | string;
  image?: string;
  imageUrls?: string[];
  name?: string;
  description?: string;
  translations?: Translations[];
  isWishlisted?: boolean;
  hasStock?: boolean;
  inStock?: boolean;
  limited?: boolean;
  comingSoon?: boolean;
  currency?: string;
  specialOffer?: SpecialOffer | null;
  productVariants?: ProductVariant[];
  productFeatures?: ProductFeature[];
  skus?: ProductSku[];
  WishlistItem?: unknown[];
}

export type CollectionListingItem = {
  id: number;
  productId?: number;
  collectionId?: number;
  sortOrder?: number;
  product?: ApiProduct;
};

export interface ProductsResponse {
  data: ApiProduct[];
  meta?: Pagination;
}
export interface SingleProductsResponse {
  data: {
    product: ApiProduct;
    relatedProducts: ApiProduct[];
  };
}

export interface CollectionListingResponse {
  data: CollectionListingItem[];
  meta?: Pagination;
}

export function normalizeProduct(
  product: ApiProduct,
  locale = "en"
): ApiProduct {
  const translation = getTranslation(product.translations ?? [], locale);

  return {
    ...product,
    id: product.id,
    slug: product.slug,
    image:
      product.imageUrls?.[0] ||
      product.image ||
      "/assets/images/productImage.svg",
    imageUrls: product.imageUrls,
    name: translation?.name ?? product.name ?? "",
    description: translation?.description ?? product.description ?? "",
    price: String(product.price ?? "0"),
    translations: product.translations ?? [],
    isWishlisted: Boolean(
      product.isWishlisted ||
        (Array.isArray(product.WishlistItem) && product.WishlistItem.length > 0)
    ),
    specialOffer: product.specialOffer ?? null,
    inStock: product.inStock,
    productVariants: product.productVariants ?? [],
    productFeatures: product.productFeatures ?? [],
    skus: product.skus ?? [],
  };
}

export function normalizeCollectionProducts(
  items: CollectionListingItem[] = [],
  locale = "en"
): ApiProduct[] {
  return items
    .map((item) => item.product)
    .filter((product): product is ApiProduct => Boolean(product))
    .map((product) => normalizeProduct(product, locale));
}
