import Image from "next/image";
import type { OrderItem } from "@/types/order";

export default function OrderDetailProducts({
  items,
}: {
  items: OrderItem[];
}) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-lg border border-border bg-white p-4 md:p-5"
        >
          <div className="relative shrink-0 overflow-hidden rounded-md bg-[#F9F6F2] md:w-40 md:h-50 w-20 h-25">
            <Image
              src={item.image || "/assets/images/productImage.svg"}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex min-w-0 flex-1 items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-primary md:text-base">
                {item.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Quantity: {item.quantity}
              </p>
            </div>
            <p className="shrink-0 text-sm text-primary md:text-base">
              AED {item.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
