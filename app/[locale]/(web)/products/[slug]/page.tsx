import ProductDetail from '@/components/ui/product-detail'
import { getProductBySlug } from '@/lib/api/products';
import { Suspense } from 'react';

export default async function page({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const productResponse = await getProductBySlug("29");
    const product = productResponse.data.product;
    const relatedProducts = productResponse.data.relatedProducts;
    console.log(product);

    return (
        <Suspense fallback={
            <div className='container'>
                loading...
            </div>
        }
        >
            <ProductDetail slug={slug} product={product} relatedProducts={relatedProducts} />
        </Suspense>
    )
}
