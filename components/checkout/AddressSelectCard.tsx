"use client";

import { Badge } from "@/components/ui/badge";
import type { Address } from "@/types/address";
import { cn } from "@/lib/utils";

type AddressSelectCardProps = {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  name: string;
};

export default function AddressSelectCard({
  address,
  selected,
  onSelect,
  name,
}: AddressSelectCardProps) {
  const fullName = `${address.firstName} ${address.lastName}`.trim();
  const lines = [address.addressLine1, address.addressLine2]
    .filter(Boolean)
    .join(", ");

  return (
    <label
      className={cn(
        "flex cursor-pointer gap-3 rounded-lg border p-4 transition",
        selected
          ? "border-tertiary bg-[#FBF7F1]"
          : "border-border bg-white hover:border-primary/30",
      )}
    >
      <input
        type="radio"
        name={name}
        className="mt-1 size-4 accent-[#8B6A3B]"
        checked={selected}
        onChange={onSelect}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-boska-medium text-base text-primary">
            {fullName || "Address"}
          </p>
          {address.isDefault ? (
            <Badge
              variant="secondary"
              className="rounded-md bg-[#F3EADF] px-2 py-1 text-[10px] font-semibold uppercase tracking-[1px] text-[#A37C43]"
            >
              Default
            </Badge>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-primary">{lines}</p>
        <p className="mt-0.5 text-sm text-gray-500">
          {[address.city, address.country].filter(Boolean).join(", ")}
        </p>
        <p className="mt-0.5 text-sm text-gray-500">{address.phone}</p>
        {address.email ? (
          <p className="mt-0.5 text-sm text-gray-500">{address.email}</p>
        ) : null}
      </div>
    </label>
  );
}
