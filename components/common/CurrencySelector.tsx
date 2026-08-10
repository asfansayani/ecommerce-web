"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES, getCurrencyLabel } from "@/lib/currencies";
import { useCurrencyStore } from "@/store/currencyStore";
import { cn } from "@/lib/utils";

type CurrencySelectorProps = {
  className?: string;
  triggerClassName?: string;
};

export default function CurrencySelector({
  className,
  triggerClassName,
}: CurrencySelectorProps) {
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);
  const hydrate = useCurrencyStore((s) => s.hydrate);
  const [query, setQuery] = useState("");

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="max-sm:hidden text-[11px] uppercase tracking-[1.5px] text-secondary/80">
        Currency
      </span>
      <Select
        value={currency}
        onValueChange={(value) => {
          if (value) setCurrency(value);
        }}
        onOpenChange={(open) => {
          if (!open) setQuery("");
        }}
      >
        <SelectTrigger
          size="sm"
          className={cn(
            "h-7 min-w-[5.5rem] border-secondary/30 bg-transparent py-1 text-[11px] font-medium uppercase tracking-[1px] text-secondary shadow-none focus-visible:border-secondary/50 focus-visible:ring-secondary/20 dark:bg-transparent",
            triggerClassName
          )}
          aria-label="Select currency"
        >
          <SelectValue>{currency}</SelectValue>
        </SelectTrigger>
        <SelectContent
          align="end"
          alignItemWithTrigger={false}
          className="max-h-72 w-64"
        >
          <div className="sticky top-0 z-10 border-b border-border bg-popover p-1.5">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search currency…"
              className="h-8 w-full rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:border-ring"
              onKeyDown={(e) => e.stopPropagation()}
            />
          </div>
          {filtered.length === 0 ? (
            <p className="px-2 py-3 text-center text-xs text-muted-foreground">
              No currencies found
            </p>
          ) : (
            filtered.map((c) => (
              <SelectItem key={c.code} value={c.code}>
                {getCurrencyLabel(c.code)}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
