import { GoArrowRight } from 'react-icons/go';
import { Link } from "@/i18n/navigation";
import Image from 'next/image';
import { Product } from '@/types/product';

type ProductProps = {
    product: Product;
};

export default function ProductCard({ product }: ProductProps) {
    return (
        <Link
            className="cursor-pointer relative group overflow-hidden"
            href={`/products/${product?.id}`}
        >
            <Image
                src={product?.image || "/assets/images/productImage.svg"}
                alt={product?.name || "Product image"}
                width={406}
                height={530}
                className="w-full"
            />
            <h3 className="capitalize line-clamp-2 2xl:text-4xl md:text-2xl text-xl font-boska-medium my-3">{product?.name}</h3>
             <p className="md:text-base 2xl:text-xl font-medium text-[12px] text-tertiary">
              {"AED" + " " + product?.price}
            </p>
        </Link>
    )
}
