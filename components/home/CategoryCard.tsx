import { GoArrowRight } from 'react-icons/go';
import { Link } from "@/i18n/navigation";
import Image from 'next/image';
import { Category } from '@/types/category';
import { getTranslation } from '@/lib/helpers/getTranslation';
import { getTranslations } from 'next-intl/server';


type CategoryProps = {
    category: Category;
    locale: string;
};

export default async function CategoryCard({ category, locale }: CategoryProps) {


    const translation = getTranslation(category.translations, locale);
    const t = await getTranslations("Categories_sec");

    return (
        <div
            className="cursor-pointer relative group overflow-hidden"

        >
            <Image
                src={category?.image ?? "/assets/images/categoryImage.svg"}
                alt={"category image"}
                width={640}
                height={740}
                className="w-full group-hover:scale-120 duration-8000"
            />
            <div className="absolute md:bottom-10 bottom-3 md:px-10 px-2 inset-s-0 text-white w-full">
                <span className="2xl:text-[12px] md:text-[10px] text-[8px] uppercase 2xl:tracking-[4px] tracking-[2px]">{translation?.description || "18k gold plated"}</span>
                <h3 className="2xl:text-4xl md:text-2xl text-xl md:mt-2 md:mb-4 mt-1 mb-2 font-boska-medium capitalize">{translation?.name}</h3>
                <Link className="inline-flex items-center justify-center font-semibold uppercase 2xl:tracking-[4px] tracking-[2px] max-2xl:text-[12px] max-md:text-[10px]"
                    href={`/shop/collections/${category?.translations?.find((translation) => translation.language === 'en')?.name?.toLowerCase().replaceAll(' ', '-')}`}>
                    {t("View Products")}
                    <GoArrowRight className="ms-2 rtl:rotate-180" />
                </Link>
            </div>
        </div>
    )
}
