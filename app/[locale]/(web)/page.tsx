import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Products from "@/components/home/Products";
import About from "@/components/home/About";
import Social from "@/components/home/Social";
import Quote from "@/components/home/Quote";
import {
  getBestSellingProducts,
  getNewArrivals,
} from "@/lib/api/products";
import { getTranslation } from "@/lib/helpers/getTranslation";
import {
  normalizeCollectionProducts,
  normalizeProduct,
  type Product,
} from "@/types/product";
import { getLocale } from "next-intl/server";

function localizeProducts(products: Product[], locale: string) {
  return products.map((product) => {
    const translation = getTranslation(product.translations, locale);
    return {
      ...product,
      name: translation?.name ?? product.name,
      description: translation?.description ?? product.description,
    };
  });
}

export default async function Home() {
  const locale = await getLocale();

  let newArrivals: Product[] = [];
  let bestSelling: Product[] = [];

  try {
    const [newArrivalsResponse, bestSellingResponse] = await Promise.all([
      getNewArrivals(4),
      getBestSellingProducts(4),
    ]);

    newArrivals = localizeProducts(
      normalizeCollectionProducts(newArrivalsResponse?.data ?? []),
      locale
    );
    bestSelling = localizeProducts(
      (bestSellingResponse?.data ?? []).map(normalizeProduct),
      locale
    );
  } catch {
    // Sections hide themselves when empty
  }

  return (
    <>
      <Hero />
      <Categories />
      <Products
        subtitle="Just landed"
        title="New Arrivals"
        products={newArrivals}
        exploreHref="/collections/new-arrivals"
      />
      <About />
      <Products
        subtitle="Customer favourites"
        title="Best Selling"
        products={bestSelling}
        exploreHref="/collections/best-selling"
      />
      <Social />
      <Quote />
    </>
  );
}
