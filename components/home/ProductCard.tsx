"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Link } from "@/i18n/navigation";
import { addToWishlist, removeFromWishlist } from "@/lib/api/wishlist";
import { cn } from "@/lib/utils";
import { useCurrencyCode } from "@/hooks/useCurrencyCode";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";
import type { ApiProduct } from "@/types/product";


type ProductProps = {
  product: ApiProduct;
};

export default function ProductCard({ product }: ProductProps) {
  const token = useAuthStore((s) => s.token);
  const increment = useWishlistStore((s) => s.increment);
  const decrement = useWishlistStore((s) => s.decrement);
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsWishlisted(product.isWishlisted);
  }, [product.isWishlisted]);

  const currency = useCurrencyCode(product.currency);
  const specialOffer = product.specialOffer;
  const hasOffer = Boolean(specialOffer);
  const displayPrice = hasOffer
    ? String(specialOffer?.discountedPrice ?? product.price)
    : product.price;

  const handleWishlistClick = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      toast.error("Please sign in to manage your wishlist");
      return;
    }

    if (isUpdating) return;

    setIsUpdating(true);
    try {
      if (isWishlisted) {
        const response = await removeFromWishlist(product.id, token);
        setIsWishlisted(false);
        decrement();
        toast.success(response.message || "Removed from wishlist");
      } else {
        const response = await addToWishlist(product.id, token);
        setIsWishlisted(true);
        increment();
        toast.success(response.message || "Added to wishlist");
      }
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : isWishlisted
            ? "Failed to remove from wishlist"
            : "Failed to add to wishlist";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  const productSlug =
    product.slug || product.name?.toLowerCase().replace(/ /g, "-") || "product";

  return (
    <Link
      className="group relative flex cursor-pointer flex-col overflow-hidden"
      href={`/products/${productSlug}?id=${product.id}`}
    >
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#F9F6F2]">
        <Image
          src={product.image || "/assets/images/productImage.svg"}
          alt={product.name || "Product image"}
          fill
          sizes="(max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {hasOffer ? (
          <span className="absolute start-3 top-3 z-10 max-w-[70%] truncate rounded-sm bg-[#A37C43] px-2 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-white md:text-xs">
            {specialOffer?.discountPercent
              ? `${specialOffer.discountPercent}% OFF`
              : specialOffer?.name}
          </span>
        ) : null}

        <button
          type="button"
          aria-label={
            isWishlisted ? "Remove from wishlist" : "Add to wishlist"
          }
          aria-pressed={isWishlisted}
          disabled={isUpdating}
          className="absolute end-3 top-3 z-10 flex size-9 items-center justify-center rounded-full bg-white/90 text-primary shadow-sm transition hover:bg-white disabled:opacity-60"
          onClick={handleWishlistClick}
        >
          <Heart
            className={cn(
              "size-4",
              isWishlisted && "fill-[#A37C43] text-[#A37C43]"
            )}
          />
        </button>
      </div>

      <h3 className="my-3 line-clamp-2 capitalize font-boska-medium text-xl md:text-2xl 2xl:text-4xl">
        {product.name || "Product Name"}
      </h3>

      <div className="flex flex-wrap items-center gap-2">
        <p className="text-[12px] font-medium text-tertiary md:text-base 2xl:text-xl">
          {currency} {displayPrice}
        </p>
        {hasOffer ? (
          <p className="text-[11px] text-gray-400 line-through md:text-sm">
            {currency} {product.price}
          </p>
        ) : null}
      </div>
    </Link>
  );
}
