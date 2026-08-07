import Image from "next/image";
import logo from "@/public/assets/images/logo.svg";
import searchIcon from "@/public/assets/images/search.svg";
import Link from "next/link";
import HeaderUserMenu from "@/components/common/HeaderUserMenu";
import HeaderWishlistIcon from "@/components/common/HeaderWishlistIcon";
import HeaderCartIcon from "@/components/common/HeaderCartIcon";

export default function Header() {
  return (
    <header className="relative z-999">
      <p className="text-center 2xl:text-[14px] text-[12px] text-secondary bg-tertiary py-2 uppercase">
        {"Handcrafted 18k Gold Plated Jewellery · Worldwide Shipping"}
      </p>
      <div className="bg-[#FCFAF7]">
        <div className="container-fluid grid grid-cols-3 items-center py-4">
          <ul className="flex 2xl:gap-10 md:gap-5 gap-1 items-center max-2xl:text-[12px] 2xl:tracking-[4px] tracking-[2px] uppercase">
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
            <li>
              <Link href={"/"}>Home</Link>
            </li>
          </ul>
          <Link href={"/"}>
            <Image src={logo} alt="Logo" className="mx-auto" />
          </Link>
          <ul className="flex 2xl:gap-10 md:gap-5 gap-1 items-center justify-end [&_img]:max-2xl:w-5 [&_img]:max-2xl:h-5">
            <li>
              <Link href={"/"}>
                <Image src={searchIcon} alt="Search" />
              </Link>
            </li>
            <HeaderWishlistIcon />
            <HeaderCartIcon />
            <li>
              <HeaderUserMenu />
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
