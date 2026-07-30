import type { OrderDetail } from "@/types/order";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="text-end text-primary">{value}</span>
    </div>
  );
}

export default function DeliveryInformationCard({
  order,
}: {
  order: OrderDetail;
}) {
  return (
    <section className="rounded-lg border border-border bg-white p-5 md:p-6">
      <h2 className="font-boska-medium text-xl text-primary md:text-2xl">
        Delivery Information
      </h2>

      <div className="mt-4 divide-y divide-border">
        <InfoRow label="Customer Name" value={order.customerName} />
        <InfoRow label="Mobile Number" value={order.mobileNumber} />
        <InfoRow label="Address" value={order.address} />
      </div>
    </section>
  );
}
