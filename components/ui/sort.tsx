"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Label } from "./label";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

const sortOptions = {
  newest: "Newest",
  name_asc: "Name: A to Z",
  name_desc: "Name: Z to A",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
};

export default function Sort({ sort = "newest" }: { sort?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="flex min-w-0 max-w-full shrink-0 items-center">
      <Label className="hidden shrink-0 text-sm font-medium text-primary sm:inline">
        Sort by:
      </Label>
      <Select
        value={sort}
        onValueChange={(value) => {
          const params = new URLSearchParams(searchParams.toString());

          params.set("sort", value ?? "");
          params.set("page", "1");

          router.push(`${pathname}?${params.toString()}`);
        }}
      >
        <SelectTrigger className="h-8 max-w-[9.5rem] border-none px-1.5 sm:max-w-none">
          <SelectValue>
            {sort
              ? sortOptions[sort as keyof typeof sortOptions]
              : "Select sort"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent alignItemWithTrigger={false}>
          {Object.entries(sortOptions).map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
