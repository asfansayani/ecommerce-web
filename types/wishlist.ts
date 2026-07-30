import { Pagination, Translations } from "./common";
import type { Product } from "./product";

export type WishlistItem = {
  id?: number;
  productId?: number;
  product?: Product & {
    images?: string[];
    imageUrl?: string;
    productImageUrls?: string[];
  };
  image?: string;
  name?: string;
  description?: string;
  price?: string | number;
  translations?: Translations[];
};

export type WishlistResponse = {
  data: WishlistItem[] | Product[];
  meta?: Pagination;
};

export function normalizeWishlistProducts(
  items: WishlistItem[] | Product[] = []
): Product[] {
  return items.map((item, index) => {
    if ("product" in item && item.product) {
      const product = item.product;
      return {
        id: product.id ?? item.productId ?? item.id ?? index + 1,
        image:
          product.image ||
          product.imageUrl ||
          product.images?.[0] ||
          product.productImageUrls?.[0] ||
          "/assets/images/productImage.svg",
        name: product.name ?? "",
        description: product.description ?? "",
        price: String(product.price ?? "0"),
        translations: product.translations ?? [],
        isWishlisted: product.isWishlisted ?? true,
        specialOffer: product.specialOffer ?? null,
      };
    }

    const direct = item as Product & WishlistItem;
    return {
      id: direct.id ?? index + 1,
      image:
        direct.image ||
        "/assets/images/productImage.svg",
      name: direct.name ?? "",
      description: direct.description ?? "",
      price: String(direct.price ?? "0"),
      translations: direct.translations ?? [],
      isWishlisted: direct.isWishlisted ?? true,
      specialOffer: direct.specialOffer ?? null,
    };
  });
}
