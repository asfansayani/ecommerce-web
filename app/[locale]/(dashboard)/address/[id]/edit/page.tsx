import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAddressById } from "@/lib/api/address";
import AddressForm from "../../AddressForm";

type EditAddressPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: EditAddressPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Edit Address ${id} – Bijou Sky`,
    description: "Update a saved delivery address on your Bijou Sky account.",
  };
}

export default async function EditAddressPage({
  params,
}: EditAddressPageProps) {
  const { id } = await params;

  let address = null;
  let hasError = false;

  try {
    const response = await getAddressById(id);
    if (!response?.data) {
      notFound();
    }
    address = response.data;
  } catch {
    hasError = true;
  }

  return (
    <div className="min-h-full">
      <div className="border-b border-border bg-[#F9F6F2] px-6 py-8 md:px-10 md:py-10">
        <p className="mb-2 text-xs uppercase tracking-[3px] text-[#A37C43]">
          Account
        </p>
        <h1 className="font-boska-bold text-3xl text-primary md:text-4xl">
          Edit Address
        </h1>
        <p className="mt-2 max-w-xl text-sm text-gray-500">
          Update the details for this delivery address.
        </p>
      </div>

      <div className="flex max-w-3xl flex-col gap-8 px-6 py-8 md:px-10 md:py-12">
        {hasError || !address ? (
          <p className="rounded-lg border border-border bg-white p-6 text-sm text-gray-500">
            Unable to load this address right now. Please try again later.
          </p>
        ) : (
          <AddressForm mode="edit" addressId={address.id} initialValues={address} />
        )}
      </div>
    </div>
  );
}
