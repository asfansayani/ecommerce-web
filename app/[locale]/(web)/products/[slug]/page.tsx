import ProductDetail from "@/components/ui/product-detail";
import { getProductById } from "@/lib/api/products";
import { normalizeProduct } from "@/types/product";
import { getLocale } from "next-intl/server";
import { notFound } from "next/navigation";

export default async function page({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ id?: string }>;
}) {
  const { slug } = await params;
  const { id } = await searchParams;
  const locale = await getLocale();

  if (!id) {
    notFound();
  }

  let productResponse;
  try {
    productResponse = await getProductById(id);
  } catch {
    notFound();
  }

  const product = normalizeProduct(productResponse.data.product, locale);
  const relatedProducts = (productResponse.data.relatedProducts ?? []).map(
    (item) => normalizeProduct(item, locale)
  );

  return (
    <ProductDetail
      slug={slug}
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
