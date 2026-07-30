import { Link } from "@/i18n/navigation";
import {
  ORDER_STATUS_FILTERS,
  type OrderStatusFilter,
} from "@/lib/data/orders";
import { cn } from "@/lib/utils";

export default function OrderStatusTabs({
  activeStatus,
}: {
  activeStatus: OrderStatusFilter;
}) {
  return (
    <div className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0">
      <nav
        aria-label="Order status filters"
        className="flex min-w-max items-center gap-5 border-b border-border md:gap-7"
      >
        {ORDER_STATUS_FILTERS.map((filter) => {
          const isActive = filter.value === activeStatus;
          const href =
            filter.value === "all"
              ? "/orders"
              : `/orders?status=${filter.value}`;

          return (
            <Link
              key={filter.value}
              href={href}
              className={cn(
                "relative pb-3 text-[11px] font-medium uppercase tracking-[2px] text-[#A37C43] transition-colors md:text-xs",
                isActive && "text-tertiary",
              )}
            >
              {filter.label}
              {isActive ? (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-tertiary" />
              ) : null}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
