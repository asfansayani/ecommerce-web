import React from 'react'
import SecHd from '../custom-ui/SecHd'
import ProductCard from '../home/ProductCard'
import { ApiProduct } from '@/types/product'

export default function RelatedProducts({relatedProducts}: {relatedProducts: ApiProduct[]}) {
  return (
    <div className="mt-20 container">
        <SecHd text="You might also like" className='text-center' />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
           {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
           ))}
        </div>
    </div>
  )
}
