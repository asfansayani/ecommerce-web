import { Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type { Address } from "@/types/address";
import DeleteAddressButton from "./DeleteAddressButton";

export default function AddressCard({ address }: { address: Address }) {
  const fullName = `${address.firstName} ${address.lastName}`.trim();
  const lines = [address.addressLine1, address.addressLine2]
    .filter(Boolean)
    .join(", ");

  return (
    <article className="rounded-lg border border-border bg-white p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-boska-medium text-xl text-primary md:text-2xl">
            {fullName || "Address"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{address.email}</p>
        </div>
        {address.isDefault ? (
          <Badge
            variant="secondary"
            className="rounded-md bg-[#F3EADF] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[1px] text-[#A37C43]"
          >
            Default
          </Badge>
        ) : null}
      </div>

      <div className="mt-5 space-y-2 text-sm">
        <p className="text-primary">{lines}</p>
        <p className="text-gray-500">
          {[address.city, address.country].filter(Boolean).join(", ")}
        </p>
        <p className="text-gray-500">{address.phone}</p>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-dashed border-border pt-5">
        <Button
          size="default"
          className="h-10 rounded-md px-4 text-xs font-semibold uppercase tracking-[1px]"
          nativeButton={false}
          render={<Link href={`/address/${address.id}/edit`} />}
        >
          <Pencil className="size-3.5" />
          Edit
        </Button>
        <DeleteAddressButton addressId={address.id} />
      </div>
    </article>
  );
}
