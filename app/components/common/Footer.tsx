import Image from 'next/image'
import React from 'react'
import logo from "@/public/assets/images/footerLogo.svg"
import searchIcon from "@/public/assets/images/search.svg"
import cartIcon from "@/public/assets/images/cart.svg"
import userIcon from "@/public/assets/images/user.svg"
import Link from 'next/link'
import LanguageSwitcher from '../LanguageSwitcher'
import { getCategories } from '@/lib/api/categories'
import { getTranslations } from 'next-intl/server'
import { FaInstagram, FaSnapchat } from 'react-icons/fa'
import { getTranslation } from '@/lib/helpers/getTranslation'

export default async function Footer({ locale }: { locale: string }) {

    const t = await getTranslations("Footer");

    const year = new Date().getFullYear();

    const categoriesData = await getCategories({
        limit: 6
    });
    const categories = categoriesData?.data || [];

    return (
        <footer className="text-primary">
            {/* Top area */}
            <div className="mx-3 md:mx-20 pt-10 lg:pt-20">
                <div className="grid md:gap-5 gap-3 2xl:gap-16 grid-cols-1 lg:grid-cols-12 items-start">
                    {/* Left: Logo + Social */}
                    <div className="lg:col-span-6 text-center lg:text-left rtl:text-right">
                        <Link href="/" aria-label="bijou Home" className="inline-block">
                            <Image src={logo} alt="bijou" className="w-[190px] 2xl:w-[276px]" />
                        </Link>
                        <p className="lg:max-w-[400px] md:mt-7 mt-4 mb-4 2xl:tracking-[4px] tracking-[2px] 2xl:text-base text-sm">
                            {t("desc")}
                        </p>

                        <ul className="flex gap-4 max-lg:justify-center items-center uppercase  text-sm">
                            {/* {t("Follow on")}: */}
                            {/* <li>
                <Link href="https://www.facebook.com">
                  <FaFacebookF />
                </Link>
              </li> */}
                            <li>
                                <Link className="2xl:w-10 2xl:h-10 w-8 h-8 rounded-full border border-brown flex justify-center items-center 2xl:text-xl text-brown" href="https://www.instagram.com/bijou.ae?igsh=MmZwdDdnd3BtZm5r&utm_source=qr" target="_blank" rel="noopener noreferrer">
                                    <FaInstagram />
                                </Link>
                            </li>
                            <li>
                                <Link className="2xl:w-10 2xl:h-10 w-8 h-8 rounded-full border border-brown flex justify-center items-center 2xl:text-xl text-brown" href="https://snapchat.com/t/GpcNFHb6" target="_blank" rel="noopener noreferrer">
                                    <FaSnapchat />
                                </Link>
                            </li>
                            {/* <li>
                <Link href="https://www.facebook.com">
                  <FaLinkedinIn />
                </Link>
              </li> */}
                        </ul>
                    </div>

                    {/* Right: 2 cols on mobile, 3 cols on sm+ */}
                    <div className="md:col-span-6 grid grid-cols-1 md:grid-cols-6 gap-5 
          // font-[250]
          ">
                        {/* SHOP */}
                        {categories?.length > 0 ? (
                            <nav aria-label={t("Shop")} className="md:col-span-2">
                                <h4 className="uppercase! 2xl:text-lg text-sm font-inter! font-medium! text-light-brown">
                                    {t("Shop")}
                                </h4>

                                <ul className="md:mt-6 mt-4 md:space-y-4 space-y-2 max-2xl:text-[12px] text-[#020202] font-normal! 2xl:tracking-[4px] tracking-[2px]">
                                    {categories.slice(0,5)?.map((item, index: any) => {
                                        const translation = getTranslation(item.translations, locale);

                                        return (
                                            <li key={index}>
                                                <Link
                                                    href={`/collections/${item?.translations
                                                        ?.find((tr: any) => tr.language === "en")
                                                        ?.name?.toLowerCase()
                                                        .split(" ")
                                                        .join("-")}?id=${item?.id}`}
                                                    className="hover:underline"
                                                >
                                                    {translation?.name}
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>
                            </nav>
                        ) : null}
                        {/* HELP */}
                        <nav aria-label={t("SUPPORT")} className="md:col-span-2">
                            <h4 className="uppercase! 2xl:text-lg text-sm font-inter! font-medium! text-light-brown">
                                {t("SUPPORT")}
                            </h4>
                            <ul className="md:mt-6 mt-4 md:space-y-4 space-y-2 max-2xl:text-[12px] text-[#020202] font-normal! 2xl:tracking-[4px] tracking-[2px]">
                                {/* <li><Link href="/shipping-policy" className="hover:text-white">{t("Shipping & Returns")}</Link></li> */}
                                <li>
                                    <Link href="/faqs" className="hover:underline">
                                        {t("FAQs")}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/track-order" className="hover:underline">
                                        {t("Track Order")}
                                    </Link>
                                </li>
                                {/* <li><Link href="/about-us" className="hover:underline">{t("About Us")}</Link></li> */}
                                <li>
                                    <Link href="/contact-us" className="hover:underline">
                                        {t("Contact Us")}
                                    </Link>
                                </li>

                            </ul>
                        </nav>
                        <nav aria-label={t("Company")} className="md:col-span-2">
                            <h4 className="uppercase! 2xl:text-lg text-sm font-inter! font-medium! text-light-brown">{t("Company")}</h4>
                            <ul className="md:mt-6 mt-4 md:space-y-4 space-y-2 max-2xl:text-[12px] text-[#020202] font-normal! 2xl:tracking-[4px] tracking-[2px]">
                                {/* <li><Link href="/shipping-policy" className="hover:text-white">{t("Shipping & Returns")}</Link></li> */}
                                <li>
                                    <Link href="/about-us" className="hover:underline">
                                        {t("Our Story")}
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy-policy" className="hover:underline">
                                        {t("Privacy Policy")}
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        href="/terms-and-conditions"
                                        className="hover:underline"
                                    >
                                        {t("Terms & Conditions")}
                                    </Link>
                                </li>
                            </ul>
                        </nav>

                        {/* ACCOUNT (full row on mobile for balance) */}
                        {/* <nav aria-label={t("STAY CONNECTED")} className="md:col-span-5">
              <h4 className="uppercase! tracking-widest 2xl:text-lg text-sm font-inter! font-medium!">
                {t("STAY CONNECTED")}
              </h4>
              <p className="md:my-6 my-4">
                {t("Join the SUYA community for new launches, exclusive offers, and skincare insights.")}
              </p>
              <form onSubmit={handleSubmit(onSubmit)} className="flex gap-3">
                <TextField
                  type="email"
                  {...register("email", {
                    required: t("Email is required"),
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: t("Please enter a valid email address"),
                    },
                  })}
                  placeholder={t("Email Address")}
                  className="grow"
                />
                <Button
                  text={t("SUBSCRIBE")}
                  type="submit"
                  btnTheme="dark"
                  className="shrink-0 max-xl:px-3!"
                />
              </form>
            </nav> */}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-8 mt-8 border-t">
                    <p className="text-[#020202] text-center sm:text-start 2xl:text-lg text-[12px] 2xl:tracking-[4px] tracking-[2px]">
                        © {year} Bijou Sky.
                    </p>

                </div>
            </div>

        </footer>
    )
}
