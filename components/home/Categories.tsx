import React from 'react'
import SecHd from '@/components/custom-ui/SecHd'
import Subtitle from '@/components/custom-ui/Subtitle'
import CategoryCard from './CategoryCard'
import { getCategories } from '@/lib/api/categories';
import { getLocale, getTranslations } from "next-intl/server";

export default async function Categories() {

    const locale = await getLocale();
    const t = await getTranslations("Categories_sec");

    const categoriesData = await getCategories({
        limit: 6
    });
    const categories = categoriesData?.data || [];

    console.log(categories, "categories")

    return (
        <section className="relative md:pt-20 pt-10 ">
            <div className="container-fluid mb-10">
                <div className="text-center">
                    <Subtitle text={t("Find Your Piece")} />
                    <SecHd text={"Shop by Category"} />
                </div>
            </div>
            <div className="grid md:grid-cols-3 grid-cols-2">
                {categories.map((item, index) => {
                    return (
                        <CategoryCard category={item} key={index} locale={locale} />
                    )
                })}
            </div>
        </section>
    )
}
