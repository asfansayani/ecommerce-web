import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PaginationControls from "@/components/dashboard/PaginationControls";
import { Link } from "@/i18n/navigation";
import { getAddresses } from "@/lib/api/address";
import type { Address } from "@/types/address";
import AddressCard from "./AddressCard";

export const metadata: Metadata = {
  title: "Addresses – Bijou Sky",
  description: "Manage your Bijou Sky delivery addresses.",
};

const PAGE_SIZE = 10;

type AddressPageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function AddressPage({ searchParams }: AddressPageProps) {
  const { page: pageParam } = await searchParams;
  const requestedPage = Math.max(1, Number(pageParam) || 1);

  let addresses: Address[] = [];
  let totalPages = 1;
  let currentPage = requestedPage;
  let total = 0;
  let hasError = false;

  try {
    const response = await getAddresses({
      page: requestedPage,
      limit: PAGE_SIZE,
    });
    addresses = response?.data ?? [];
    totalPages = Math.max(1, response?.meta?.totalPages ?? 1);
    currentPage = response?.meta?.page ?? requestedPage;
    total = response?.meta?.total ?? addresses.length;
  } catch {
    hasError = true;
  }

  return (
    <div className="min-h-full">
      <div className="border-b border-border bg-[#F9F6F2] px-6 py-8 md:px-10 md:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
              Account
            </p>
            <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
              Addresses
            </h1>
            <p className="mt-2 max-w-xl text-sm text-gray-500">
              Manage the delivery addresses saved to your account.
              {!hasError && total > 0
                ? ` ${total} address${total === 1 ? "" : "es"}.`
                : null}
            </p>
          </div>

          <Button
            className="h-10 self-start rounded-md px-4 text-xs font-semibold uppercase tracking-[1px] sm:self-auto"
            nativeButton={false}
            render={<Link href="/address/new" />}
          >
            <Plus className="size-4" />
            Add Address
          </Button>
        </div>
      </div>

      <div className="px-6 py-8 md:px-10 md:py-12">
        <div className="flex max-w-3xl flex-col gap-4 md:gap-5">
          {hasError ? (
            <p className="rounded-lg border border-border bg-white p-6 text-sm text-gray-500">
              Unable to load addresses right now. Please try again later.
            </p>
          ) : addresses.length === 0 ? (
            <p className="rounded-lg border border-border bg-white p-6 text-sm text-gray-500">
              You haven&apos;t saved any addresses yet. Add one to check out
              faster.
            </p>
          ) : (
            <>
              {addresses.map((address) => (
                <AddressCard key={address.id} address={address} />
              ))}

              <div className="pt-2">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath="/address"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
