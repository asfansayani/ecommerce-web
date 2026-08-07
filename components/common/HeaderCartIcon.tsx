"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import cartIcon from "@/public/assets/images/cart.svg";
import { Link } from "@/i18n/navigation";
import { useCartStore } from "@/store/cartStore";

export default function HeaderCartIcon() {
  const items = useCartStore((s) => s.items);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted
    ? items.reduce((sum, item) => sum + item.quantity, 0)
    : 0;
  const hasItems = totalItems > 0;

  return (
    <li>
      <Link
        href="/cart"
        aria-label={
          hasItems
            ? `Cart with ${totalItems} item${totalItems === 1 ? "" : "s"}`
            : "Cart is empty"
        }
        className="relative inline-flex items-center justify-center"
      >
        <Image src={cartIcon} alt="Cart" />
        {hasItems ? (
          <span className="absolute -end-2 -top-2 flex size-4 items-center justify-center rounded-full bg-tertiary text-[10px] font-semibold text-white">
            {totalItems > 9 ? "9+" : totalItems}
          </span>
        ) : null}
      </Link>
    </li>
  );
}
