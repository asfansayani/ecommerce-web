import SecHd from "@/components/custom-ui/SecHd";
import Subtitle from "@/components/custom-ui/Subtitle";
import LinkButton from "@/components/custom-ui/LinkButton";
import ProductCard from "./ProductCard";

export default function Products() {
    return (
        <section className="relative md:py-20 py-10">
            <div className="container-fluid">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6 mb-10 md:mb-12">
                    <div>
                        <Subtitle text={"Just landed"} />
                        <SecHd text={"new Arrivals"} />
                    </div>
                    <LinkButton
                        text={"Explore All"}
                        btnTheme="dark"
                        icon
                        className="max-md:hidden"
                        link={""}
                    />
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {products?.map((p: any, idx: number) => (
                        <ProductCard product={p} key={p?.id ?? idx} />
                    ))}
                </div>
            </div>
        </section>
    )
}

const products = [
    {
        id: 1,
        name: "Aurelia Pendant",
        image: "/assets/images/productImage.svg",
        price: 121.15,
        description: "Explore our exquisite collection of pendants, crafted with precision and elegance. From timeless classics to contemporary designs, find the perfect pendant to express your unique style.",
    },
    {
        id: 2,
        name: "Aurelia Pendant",
        image: "/assets/images/productImage.svg",
        price: 130.15,
        description: "Explore our exquisite collection of pendants, crafted with precision and elegance. From timeless classics to contemporary designs, find the perfect pendant to express your unique style.",
    },
    {
        id: 3,
        name: "Aurelia Pendant",
        image: "/assets/images/productImage.svg",
        price: 130.15,
        description: "Explore our exquisite collection of pendants, crafted with precision and elegance. From timeless classics to contemporary designs, find the perfect pendant to express your unique style.",
    },
    {
        id: 4,
        name: "Aurelia Pendant",
        image: "/assets/images/productImage.svg",
        price: 130.15,
        description: "Explore our exquisite collection of pendants, crafted with precision and elegance. From timeless classics to contemporary designs, find the perfect pendant to express your unique style.",
    },
]