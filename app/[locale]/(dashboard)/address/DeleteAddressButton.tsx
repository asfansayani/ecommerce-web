"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { deleteAddress } from "@/lib/api/address";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "@/i18n/navigation";

type DeleteAddressButtonProps = {
  addressId: number;
};

export default function DeleteAddressButton({
  addressId,
}: DeleteAddressButtonProps) {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!token) {
      toast.error("You must be signed in to delete an address.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const response = await deleteAddress(addressId, token);
      toast.success(response.message || "Address deleted successfully");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unable to delete address";
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="default"
      className="h-10 rounded-md border-destructive/40 px-4 text-xs font-semibold uppercase tracking-[1px] text-destructive hover:bg-destructive/5"
      disabled={isDeleting}
      onClick={handleDelete}
    >
      {isDeleting ? "Deleting..." : "Delete"}
    </Button>
  );
}
