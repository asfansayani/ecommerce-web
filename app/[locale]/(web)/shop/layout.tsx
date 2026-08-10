import Filters from "@/components/ui/filters";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="container relative py-4 md:grid md:grid-cols-4 md:items-start md:gap-4 md:py-10">
      <div className="hidden md:sticky md:top-5 md:col-span-1 md:block">
        <Filters />
      </div>
      <div className="min-w-0 md:col-span-3">{children}</div>
    </section>
  );
}
