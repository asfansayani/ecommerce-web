import ProductsNotFound from "@/components/common/ProductsNotFound";
import PaginationControls from "@/components/dashboard/PaginationControls";
import ProductCard from "@/components/home/ProductCard";
import Sort from "@/components/ui/sort";
import { getCategories } from "@/lib/api/categories";
import { getProductByCategory } from "@/lib/api/products";
import { localizeProducts } from "@/lib/utils";

export default async function Page(
    {
        params,
        searchParams,
    }: {
        params: Promise<{
            slug: string[];
            locale: string;
        }>;
        searchParams: Promise<{
            page?: string;
            sort?: string;
            color?: string;
            size?: string;
        }>;
    }
) {

    const PAGE_SIZE = 8;
    const { slug, locale } = await params;
    const { page, sort, color, size } = await searchParams;
    const requestedPage = Math.max(1, Number(page) || 1);

    const query = new URLSearchParams();
    
    if (sort) query.set("sort", sort);
    if (color) query.set("color", color);
    if (size) query.set("size", size);
    const basePath = `/shop/collections/${slug?.length > 0 ? slug.join("/") : ""}${query.toString() ? `?${query}` : ""
        }`;


        const categories = await getCategories({
            depth: 3,
            limit: 999,
        });

        const category = categories.data.find((category) => category?.translations?.find((translation) => translation.language === 'en')?.name?.toLowerCase().replaceAll(' ', '-') === slug?.[0].toLowerCase().replaceAll(' ', '-'));

    const { data: productsResponse, meta } = await getProductByCategory({
        categoryId: category?.id ?? '',
        page: requestedPage,
        limit: PAGE_SIZE,
        ...(sort && { sort }),
        // ...(color && { color }),
        // ...(size && { size }),
    });


    const products = localizeProducts(productsResponse ?? [], locale);
    const totalPages = Math.max(1, meta?.totalPages ?? 1);

    const isEmpty = products.length === 0;

    return (
        <div>
            <div className="flex justify-between items-center mb-4 gap-3">
                <h2 className="text-2xl font-bold capitalize">{slug?.[slug.length - 1] ?? 'Products'}</h2>
                {!isEmpty && (
                    <p className="text-sm text-gray-500 capitalize ms-auto shrink-0">
                        showing {PAGE_SIZE * (requestedPage - 1) + 1}-{Math.min(PAGE_SIZE * requestedPage, meta?.total ?? 0)} of {meta?.total ?? 0} products
                    </p>
                )}
                <Sort sort={sort} />
            </div>
            {isEmpty ? (
                <ProductsNotFound />
            ) : (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    <div className="mt-10">
                        <PaginationControls
                            currentPage={requestedPage}
                            totalPages={totalPages}
                            basePath={basePath}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
