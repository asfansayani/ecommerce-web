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
  type ApiProduct,
} from "@/types/product";
import { getLocale } from "next-intl/server";
import { localizeProducts } from "@/lib/utils";


export default async function Home() {
  const locale = await getLocale();

  let newArrivals: ApiProduct[] = [];
  let bestSelling: ApiProduct[] = [];

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
      (bestSellingResponse?.data ?? []).map((product) =>
        normalizeProduct(product, locale)
      ),
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
