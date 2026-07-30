import SecHd from '@/components/custom-ui/SecHd'
import Subtitle from '@/components/custom-ui/Subtitle'
import Link from 'next/link'
import Image from 'next/image'
import insta from '@/public/assets/images/insta.webp'

export default function Social() {
    return (
        <section className="relative 2xl:pb-25 lg:pb-15 pb-10">
            <div className="container-fluid mb-10">
                <div className="text-center">
                    <Subtitle text={"@bijousky"} />
                    <SecHd text={"Follow Us on Instagram"} />
                </div>
            </div>
            <div className="grid md:grid-cols-5">
                {categories.map((item, index) => {
                    return (
                        <div key={index} className='relative'>
                            <Image src={item.image} alt={item.name} width={400} height={400} />
                            <Link target="_blank" className='absolute opacity-0 hover:opacity-100 duration-400 inset-0 bg-[#CEAF9199]/60 w-full h-full flex items-center justify-center' href={`/collections/${item.name.toLowerCase()}`} key={index}>
                                <Image src={insta} alt={item.name} width={60} height={60} />
                            </Link>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}


const categories = [
    {
        id: 1,
        name: "Rings",
        image: "/assets/images/categoryImage.svg",
        description: "Explore our exquisite collection of rings, crafted with precision and elegance. From timeless classics to contemporary designs, find the perfect ring to express your unique style.",
    },
    {
        id: 2,
        name: "Necklaces",
        image: "/assets/images/categoryImage.svg",
        description: "Discover our stunning selection of necklaces, each piece a testament to our commitment to quality and design. Whether you prefer delicate chains or bold statement pieces, you'll find something to suit your taste.",
    },
    {
        id: 3,
        name: "Earrings",
        image: "/assets/images/categoryImage.svg",
        description: "Adorn yourself with our beautifully crafted earrings, designed to complement any outfit. From subtle studs to elaborate dangles, find the perfect pair to enhance your look.",
    },
    {
        id: 4,
        name: "Rings",
        image: "/assets/images/categoryImage.svg",
        description: "Explore our exquisite collection of rings, crafted with precision and elegance. From timeless classics to contemporary designs, find the perfect ring to express your unique style.",
    },
    {
        id: 5,
        name: "Necklaces",
        image: "/assets/images/categoryImage.svg",
        description: "Discover our stunning selection of necklaces, each piece a testament to our commitment to quality and design. Whether you prefer delicate chains or bold statement pieces, you'll find something to suit your taste.",
    }
]