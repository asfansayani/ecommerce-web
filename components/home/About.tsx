import Image from 'next/image'
import Subtitle from '@/components/custom-ui/Subtitle'
import SecHd from '@/components/custom-ui/SecHd'
import LinkButton from '@/components/custom-ui/LinkButton'

export default function About() {
    return (
        <section className={`grid grid-cols-2 items-stretch`}>
            <div className="md:col-span-1 col-span-2">
                <Image
                    src={"/assets/images/aboutImage.png"}
                    alt="About Us"
                    className="w-full"
                    width={920}
                    height={1000}
                />
            </div>
            <div className="md:col-span-1 col-span-2 2xl:px-20 md:px-10 px-3 max-md:py-5 md:gap-3 gap-3 flex flex-col justify-center bg-tertiary">
                <Subtitle className="text-[#DBBE94]!" text={"Our Atelier"} />
                <SecHd
                    className="text-white!"
                    text={"Born from the earth, shaped by light."}
                />
                <p className="text-[#DBBE94]">
                    {"Each product is selected with care — prioritizing quality, trust, and everyday usability. From personal care and cosmetics to therapeutic solutions and essentials, BIJOU Sky brings together items that support balance, confidence, and well-being."}
                </p>

                <LinkButton btnTheme="light" className="w-fit mt-5"
                    icon
                    text={"Read our story"}
                    link={"/about-us"}
                />
            </div>
        </section>
    )
}
