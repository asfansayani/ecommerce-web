"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";
import { useWishlistStore } from "@/store/wishlistStore";

export default function HeaderWishlistIcon() {
  const token = useAuthStore((s) => s.token);
  const count = useWishlistStore((s) => s.count);
  const syncFromApi = useWishlistStore((s) => s.syncFromApi);
  const reset = useWishlistStore((s) => s.reset);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (token) {
      void syncFromApi();
      return;
    }

    reset();
  }, [mounted, token, syncFromApi, reset]);

  if (!mounted || !token) {
    return null;
  }

  const hasItems = count > 0;

  return (
    <li>
      <Link
        href="/wishlist"
        aria-label={hasItems ? "Wishlist has items" : "Wishlist is empty"}
        className="inline-flex items-center justify-center text-primary"
      >
        <Heart
          className={cn(
            "size-7",
            hasItems && "fill-[#A37C43] text-[#A37C43]"
          )}
        />
      </Link>
    </li>
  );
}
