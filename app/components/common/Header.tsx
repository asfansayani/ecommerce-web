import Image from 'next/image'
import React from 'react'
import logo from "@/public/assets/images/logo.svg"
import searchIcon from "@/public/assets/images/search.svg"
import cartIcon from "@/public/assets/images/cart.svg"
import userIcon from "@/public/assets/images/user.svg"
import Link from 'next/link'
import LanguageSwitcher from '../LanguageSwitcher'

export default function Header() {
    return (
        <header className='relative z-999'>
            <p className="text-center 2xl:text-[14px] text-[12px] text-secondary bg-tertiary py-2 uppercase">
                {"Handcrafted 18k Gold Plated Jewellery · Worldwide Shipping"}
            </p>
            <div className="bg-[#FCFAF7]">
                <div className="container-fluid grid grid-cols-3 items-center py-4">
                    <ul className="flex 2xl:gap-10 md:gap-5 gap-1 items-center max-2xl:text-[12px] 2xl:tracking-[4px] tracking-[2px] uppercase">
                        <li>
                            <Link href={"/"}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"}>
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"}>
                                Home
                            </Link>
                        </li>
                    </ul>
                    <div>
                        <Image src={logo} alt="Logo" className="mx-auto" />
                    </div>
                    <ul className="flex 2xl:gap-10 md:gap-5 gap-1 items-center justify-end [&_img]:max-2xl:w-5 [&_img]:max-2xl:h-5">
                        <li>
                            <Link href={"/"}>
                                <Image src={searchIcon} alt="Search" />
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"}>
                                <Image src={cartIcon} alt="Cart" />
                            </Link>
                        </li>
                        <li>
                            <Link href={"/"}>
                                <Image src={userIcon} alt="User" />
                            </Link>
                        </li>

                        {/* <li>
                            <LanguageSwitcher />
                        </li> */}

                    </ul>
                </div>
            </div>
        </header>
    )
}
