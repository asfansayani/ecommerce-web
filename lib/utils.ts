import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getTranslation } from "./helpers/getTranslation";
import { ApiProduct } from "@/types/product";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function localizeProducts(products: ApiProduct[], locale: string) {
  return products.map((product) => {
    const translation = getTranslation(product.translations, locale);
    return {
      ...product,
      name: translation?.name ?? product.name,
      description: translation?.description ?? product.description,
    };
  });
}