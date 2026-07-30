import SecHd from "@/components/custom-ui/SecHd";
import Subtitle from "@/components/custom-ui/Subtitle";
import LinkButton from "@/components/custom-ui/LinkButton";
import ProductCard from "./ProductCard";
import type { Product } from "@/types/product";

type ProductsSectionProps = {
  subtitle: string;
  title: string;
  products: Product[];
  exploreHref?: string;
};

export default function Products({
  subtitle,
  title,
  products,
  exploreHref = "/collections/new-arrivals",
}: ProductsSectionProps) {
  if (!products.length) {
    return null;
  }

  return (
    <section className="relative md:py-20 py-10">
      <div className="container-fluid">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-10 md:mb-12">
          <div>
            <Subtitle text={subtitle} />
            <SecHd text={title} />
          </div>
          <LinkButton
            text={"Explore All"}
            btnTheme="dark"
            icon
            className="max-md:hidden"
            link={exploreHref}
          />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard product={product} key={product.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
