import { Pagination, Translations } from "./common";

export type SpecialOffer = {
  id: number;
  name: string;
  discountPercent: string;
  createdAt?: string;
  updatedAt?: string;
  discountedPrice?: number | string;
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
  specialOffer?: SpecialOffer | null;
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

export interface CollectionListingResponse {
  data: CollectionListingItem[];
  meta?: Pagination;
}

export function normalizeProduct(product: ApiProduct): Product {
  return {
    id: product.id,
    slug: product.slug,
    image:
      product.imageUrls?.[0] ||
      product.image ||
      "/assets/images/productImage.svg",
    name: product.name ?? "",
    description: product.description ?? "",
    price: String(product.price ?? "0"),
    translations: product.translations ?? [],
    isWishlisted: Boolean(product.isWishlisted),
    specialOffer: product.specialOffer ?? null,
  };
}

export function normalizeCollectionProducts(
  items: CollectionListingItem[] = []
): Product[] {
  return items
    .map((item) => item.product)
    .filter((product): product is ApiProduct => Boolean(product))
    .map(normalizeProduct);
}
