import React from 'react'
import heroImage from "@/public/assets/images/hero.svg"
import Image from 'next/image'
import Subtitle from '@/components/custom-ui/Subtitle'
import LinkButton from '@/components/custom-ui/LinkButton'
import { HiOutlineArrowLongRight } from 'react-icons/hi2'
import Link from 'next/link'

export default function Hero() {
    return (
        <section className='bg-[#FCFAF7] relative'>
            <span className="absolute font-cormorant 2xl:text-[315px] lg:text-[240px] text-[#6D49170D] 2xl:-top-22 lg:-top-16 max-lg:hidden inset-s-[52%] ltr:-translate-x-1/2 rtl:translate-x-1/2">BIJOU</span>
            <div className='container-fluid grid grid-cols-2 items-center pt-4'>
                <div className='md:pe-10'>
                    <Subtitle text="Fine Jewellery · Est. 2026" />
                    <h1 className='heroHd my-5'>Artistry in the <span className='text-tertiary block'>golden hour</span></h1>
                    <p>Hand-finished 18K gold-plated pieces, made to catch the soft warmth of twilight on bare skin. Designed to be layered, lived in, and loved.</p>
                    <div className="flex items-center 2xl:gap-10 md:gap-5 gap-3 flex-wrap md:mt-10 mt-5">
                        <LinkButton icon btnTheme="dark" text={"EXPLORE COLLECTION"} link={"/all-collections"} />
                        <Link href="/collections/new-arrivals" className="flex items-center gap-2 font-semibold max-md:text-[10px] max-2xl:text-[12px] text-light-brown pb-2.5 border-b-2 border-black 2xl:tracking-[4px] tracking-[2px]">NEW ARRIVALS <HiOutlineArrowLongRight className='rtl:rotate-180' /></Link>
                    </div>
                </div>
                <div>
                    <Image src={heroImage} alt="Hero Image" />
                </div>
            </div>
        </section>
    )
}
