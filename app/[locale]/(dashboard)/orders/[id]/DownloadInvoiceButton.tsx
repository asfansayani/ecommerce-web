"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { downloadOrderInvoice } from "@/lib/api/orders";
import { useAuthStore } from "@/store/authStore";

type DownloadInvoiceButtonProps = {
  orderId: string | number;
};

export default function DownloadInvoiceButton({
  orderId,
}: DownloadInvoiceButtonProps) {
  const token = useAuthStore((s) => s.token);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!token) {
      toast.error("You must be signed in to download the invoice.");
      return;
    }

    setIsDownloading(true);
    try {
      const { blob, filename } = await downloadOrderInvoice(orderId, token);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("Invoice downloaded successfully");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to download invoice";
      toast.error(message);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button
      size="default"
      className="h-10 rounded-md px-4 text-xs font-semibold uppercase tracking-[1px]"
      disabled={isDownloading}
      onClick={handleDownload}
    >
      {isDownloading ? "Downloading..." : "View Invoice"}
    </Button>
  );
}
