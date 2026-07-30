import { Check } from "lucide-react";
import type { OrderStatus } from "@/types/order";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "paid", label: "Paid" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

function getCompletedCount(status: OrderStatus) {
  switch (status) {
    case "unpaid":
      return 0;
    case "pending_confirmation":
    case "processing":
      return 2;
    case "shipped":
      return 3;
    case "delivered":
      return 4;
    case "cancelled":
    case "refunded":
      return 0;
    default:
      return 1;
  }
}

export default function OrderStatusStepper({
  status,
}: {
  status: OrderStatus;
}) {
  const completed = getCompletedCount(status);

  return (
    <div className="">
      <ol className="relative flex items-start justify-between">
        <span
          aria-hidden
          className="absolute top-4 start-4 end-4 border-t border-dashed border-border"
        />
        {completed > 1 ? (
          <span
            aria-hidden
            className="absolute top-4 start-4 h-px border-t border-dashed border-[#C4A574]"
            style={{
              width: `calc((100% - 2rem) * ${(completed - 1) / (STEPS.length - 1)})`,
            }}
          />
        ) : null}

        {STEPS.map((step, index) => {
          const isDone = index < completed;
          const isFirst = index === 0;
          const isLast = index === STEPS.length - 1;

          return (
            <li
              key={step.key}
              className={cn(
                "relative z-10 flex flex-col",
                isFirst && "items-start",
                isLast && "items-end",
                !isFirst && !isLast && "items-center",
              )}
            >
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border",
                  isDone
                    ? "border-[#C4A574] bg-[#C4A574] text-white"
                    : "border-border bg-[#E8E8E8] text-gray-400",
                )}
              >
                <Check className="size-4" strokeWidth={2.5} />
              </span>

              <span
                className={cn(
                  "mt-3 text-[11px] font-medium md:text-sm",
                  isDone ? "text-primary" : "text-gray-400",
                  isFirst && "text-start",
                  isLast && "text-end",
                  !isFirst && !isLast && "text-center",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
