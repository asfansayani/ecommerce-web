import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";

type ProductsNotFoundProps = {
  title?: string;
  description?: string;
};

export default function ProductsNotFound({
  title = "No Products Found",
  description = "We couldn't find any products matching your filters. Try adjusting your search or browse our full collection.",
}: ProductsNotFoundProps) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-full border border-primary/10 bg-primary/5">
        <PackageOpen className="size-7 text-primary/60" strokeWidth={1.25} />
      </div>

      <h3 className="font-boska-bold text-2xl leading-tight text-primary md:text-3xl">
        {title}
      </h3>

      {description ? (
        <p className="mt-3 max-w-md text-sm leading-relaxed text-gray-500">
          {description}
        </p>
      ) : null}

      <Button
        size="lg"
        nativeButton={false}
        render={<Link href="/shop/products" />}
        className="mt-8 h-11 rounded-md bg-tertiary px-7 text-xs font-semibold uppercase tracking-[0.12em] text-white hover:bg-tertiary/90"
      >
        Browse All Products
      </Button>
    </div>
  );
}
