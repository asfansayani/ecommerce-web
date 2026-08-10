"use client";

import { useCallback, useMemo, useState } from "react";
import { RadioGroup } from "@base-ui/react/radio-group";
import { toast } from "sonner";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useLocale } from "next-intl";
import { RadioGroupItem } from "./radio-group";
import { Label } from "./label";
import { Button } from "./button";
import RelatedProducts from "../website/related-products";
import ProductImageGallery from "./product-image-gallery";
import { useCurrencyCode } from "@/hooks/useCurrencyCode";
import { useCartStore } from "@/store/cartStore";
import { getTranslation } from "@/lib/helpers/getTranslation";
import type { CartVariantSelection } from "@/types/cart";
import type { ApiProduct } from "@/types/product";


export default function ProductDetail({
  slug,
  product,
  relatedProducts,
}: {
  slug: string;
  product: ApiProduct;
  relatedProducts: ApiProduct[];
}) {
  const locale = useLocale();
  const currency = useCurrencyCode(product.currency);
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);
  const [selectedValues, setSelectedValues] = useState<Record<number, number>>(
    () => {
      const defaults: Record<number, number> = {};
      for (const productVariant of product.productVariants ?? []) {
        const variantId = productVariant.variantId ?? productVariant.id;
        const firstValue =
          productVariant.productVariantValues?.[0]?.variantValueId ??
          productVariant.productVariantValues?.[0]?.variantValue?.id;
        if (variantId != null && firstValue != null) {
          defaults[variantId] = firstValue;
        }
      }
      return defaults;
    }
  );
  const name = product.name || "Product";
  const description = product.description || "";
  const hasOffer = Boolean(product.specialOffer);
  const displayPrice = hasOffer
    ? String(product.specialOffer?.discountedPrice ?? product.price ?? "0")
    : String(product.price ?? "0");

  const productVariants = product.productVariants ?? [];
  const productFeatures = product.productFeatures ?? [];

  const selectedSku = useMemo(() => {
    const skus = product.skus ?? [];
    if (!skus.length) return null;

    const selectedEntries = Object.entries(selectedValues);
    if (!selectedEntries.length) {
      return skus.find((sku) => sku.selectionKey === "DEFAULT") ?? skus[0];
    }

    return (
      skus.find((sku) => {
        const values = sku.values ?? [];
        if (!values.length) return false;
        return selectedEntries.every(([variantId, valueId]) =>
          values.some(
            (v) =>
              v.variantId === Number(variantId) &&
              v.variantValueId === valueId
          )
        );
      }) ?? null
    );
  }, [product.skus, selectedValues]);

  const images = useMemo(() => {
    // Prefer images from the currently selected variant value (e.g. color)
    for (const productVariant of productVariants) {
      const variantId = productVariant.variantId ?? productVariant.id;
      const selectedValueId = selectedValues[variantId];
      if (selectedValueId == null) continue;

      const option = productVariant.productVariantValues?.find(
        (v) =>
          (v.variantValueId ?? v.variantValue?.id) === selectedValueId
      );
      const variantImages = option?.imageUrls?.filter(Boolean) ?? [];
      if (variantImages.length) return variantImages;
    }

    const skuImages = selectedSku?.imageUrls?.filter(Boolean) ?? [];
    if (skuImages.length) return skuImages;

    const productImages = product.imageUrls?.filter(Boolean) ?? [];
    if (productImages.length) return productImages;
    if (product.image) return [product.image];
    return ["/assets/images/productImage.svg"];
  }, [
    product.image,
    product.imageUrls,
    productVariants,
    selectedSku,
    selectedValues,
  ]);

  const [activeImage, setActiveImage] = useState(
    () => images[0] || "/assets/images/productImage.svg"
  );

  const handleActiveImageChange = useCallback((imageUrl: string) => {
    setActiveImage(imageUrl);
  }, []);

  const selectedVariants = useMemo((): CartVariantSelection[] => {
    const result: CartVariantSelection[] = [];

    for (const productVariant of productVariants) {
      const variantId = productVariant.variantId ?? productVariant.id;
      const selectedValueId = selectedValues[variantId];
      if (selectedValueId == null) continue;

      const variantName =
        getTranslation(productVariant.variant?.translations ?? [], locale)
          ?.name ??
        productVariant.variant?.translations?.[0]?.name ??
        "Option";

      const option = productVariant.productVariantValues?.find(
        (v) => (v.variantValueId ?? v.variantValue?.id) === selectedValueId
      );
      const valueTranslation =
        getTranslation(option?.variantValue?.translations ?? [], locale) ??
        option?.variantValue?.translations?.[0];

      result.push({
        variantId,
        variantName,
        valueId: selectedValueId,
        valueName: valueTranslation?.name ?? String(selectedValueId),
        colorCode: valueTranslation?.code?.trim() || null,
      });
    }

    return result;
  }, [locale, productVariants, selectedValues]);

  const availableQty =
    selectedSku?.inventory?.availableQuantity ??
    (product.inStock === false ? 0 : undefined);

  const handleAddToCart = () => {
    if (!product.id) {
      toast.error("Unable to add this product to cart");
      return;
    }

    if (productVariants.length > 0) {
      const missing = productVariants.some(
        (pv) => pv.variantId != null && selectedValues[pv.variantId] == null
      );
      if (missing) {
        toast.error("Please select all options");
        return;
      }
    }

    if (availableQty !== undefined && availableQty < 1) {
      toast.error("This product is out of stock");
      return;
    }

    addItem({
      productId: product.id,
      productSkuId: selectedSku?.id ?? null,
      name,
      slug: product.slug ?? slug,
      price: displayPrice,
      image: activeImage || images[0],
      quantity,
      variants: selectedVariants,
    });

    toast.success("Added to cart");
  };

  return (
    <>
      <div className="container relative mt-10 grid grid-cols-1 items-start gap-10 md:grid-cols-2">
        <div className="sticky top-5 col-span-1">
          <ProductImageGallery
            images={images}
            alt={name}
            onActiveImageChange={handleActiveImageChange}
          />
        </div>

        <div className="sticky top-5 col-span-1 space-y-3">
          <h1 className="text-2xl font-extrabold uppercase">{name}</h1>

          <div className="flex items-center gap-2">
            <h5 className="text-2xl font-semibold">
              {currency} {displayPrice}
              {hasOffer ? (
                <span className="ms-2 text-gray-400 line-through">
                  {currency} {product.price}
                </span>
              ) : null}
            </h5>
            {product.specialOffer?.discountPercent ? (
              <span className="rounded-full bg-red-500/10 px-3 py-1 text-sm font-medium text-red-500">
                -{product.specialOffer.discountPercent}%
              </span>
            ) : null}
          </div>

          {description ? (
            <p className="text-gray-500 max-xl:text-sm">{description}</p>
          ) : null}

          {productFeatures.length > 0 ? (
            <ul className="list-disc space-y-1 ps-5 text-sm text-black/70">
              {productFeatures.map((feature) => {
                const featureText =
                  getTranslation(feature.translations ?? [], locale)?.text ??
                  feature.translations?.[0]?.text;
                if (!featureText) return null;
                return <li key={feature.id}>{featureText}</li>;
              })}
            </ul>
          ) : null}

          {productVariants.map((productVariant) => {
            const variantId = productVariant.variantId ?? productVariant.id;
            const variantName =
              getTranslation(productVariant.variant?.translations ?? [], locale)
                ?.name ??
              productVariant.variant?.translations?.[0]?.name ??
              "Option";
            const options = productVariant.productVariantValues ?? [];
            if (!options.length) return null;

            const selected = selectedValues[variantId];
            const groupValue =
              selected != null ? String(selected) : undefined;

            return (
              <div key={productVariant.id} className="border-b pb-4">
                <h6 className="mb-2 text-sm text-black/60">
                  Select {variantName}
                </h6>
                <RadioGroup
                  value={groupValue}
                  onValueChange={(value) =>
                    setSelectedValues((prev) => ({
                      ...prev,
                      [variantId]: Number(value),
                    }))
                  }
                  className="flex w-fit flex-wrap gap-2 pt-2"
                >
                  {options.map((option) => {
                    const valueId =
                      option.variantValueId ?? option.variantValue?.id;
                    if (valueId == null) return null;
                    const valueTranslation =
                      getTranslation(
                        option.variantValue?.translations ?? [],
                        locale
                      ) ?? option.variantValue?.translations?.[0];
                    const label =
                      valueTranslation?.name ?? String(valueId);
                    const colorCode = valueTranslation?.code?.trim() ?? "";
                    const isColor = colorCode.length > 0;
                    const inputId = `variant-${variantId}-${valueId}`;

                    return (
                      <div key={option.id}>
                        <RadioGroupItem
                          value={String(valueId)}
                          id={inputId}
                          className="sr-only absolute size-0 border-0"
                        />
                        {isColor ? (
                          <Label
                            htmlFor={inputId}
                            title={label}
                            aria-label={label}
                            className="block size-9 cursor-pointer rounded-full border border-black/15 ring-offset-2 peer-data-checked:ring-2 peer-data-checked:ring-black"
                            style={{ backgroundColor: colorCode }}
                          />
                        ) : (
                          <Label
                            htmlFor={inputId}
                            className="cursor-pointer rounded-full bg-[#F0F0F0] px-5 py-3 text-black/60 peer-data-checked:bg-black peer-data-checked:text-white"
                          >
                            {label}
                          </Label>
                        )}
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            );
          })}

          {availableQty === 0 ? (
            <p className="text-sm font-medium text-red-600">Out of stock</p>
          ) : product.limited && availableQty != null && availableQty > 10 ? (
            <p className="flex items-center gap-2 text-sm font-medium text-black">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
              </span>
              Limited Stock Alert: Get Yours Before They&apos;re Gone!
            </p>
          ) : product.limited &&
            availableQty != null &&
            availableQty > 0 &&
            availableQty <= 10 ? (
            <p className="flex items-center gap-2 text-sm font-medium text-red-600">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-red-500" />
              </span>
              Only {availableQty} left in stock - Act Fast!
            </p>
          ) : null}

          <div className="flex gap-5">
            <div className="flex items-center gap-5 rounded-full bg-[#F0F0F0]">
              <button
                type="button"
                aria-label="Decrease quantity"
                className="p-3"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="min-w-4 text-center text-sm text-black/60">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                className="p-3"
                onClick={() =>
                  setQuantity((q) =>
                    availableQty != null ? Math.min(availableQty, q + 1) : q + 1
                  )
                }
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <Button
              className="flex-1 rounded-full md:h-11"
              onClick={handleAddToCart}
              disabled={availableQty === 0}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <RelatedProducts relatedProducts={relatedProducts} />
    </>
  );
}
