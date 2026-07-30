import React, { ReactNode } from 'react'
import { Link } from "@/i18n/navigation";
import { HiOutlineArrowLongRight } from 'react-icons/hi2';

type Props = React.LinkHTMLAttributes<HTMLAnchorElement> & {
    icon?: boolean
    text: ReactNode
    className?: string
    btnTheme?: "light" | "transparent" | "dark"
    link: string
}

export default function LinkButton({ icon, text, className, btnTheme = "dark", link, ...props }: Props) {
    return (
        <Link
            href={link}
            {...props}
            className={`disabled:cursor-not-allowed! inline-flex gap-2 uppercase relative rounded-xs items-center justify-center max-md:text-[10px] max-2xl:text-[12px] border  px-4 md:px-6 py-2 md:py-3 transition
            ${btnTheme === "light" ? "bg-secondary text-tertiary hover:bg-tertiary hover:text-secondary border-secondary" : btnTheme === "dark" ? "bg-tertiary text-secondary hover:bg-secondary hover:text-tertiary border-tertiary" : "text-secondary hover:bg-secondary hover:text-primary border-primary"}
            ${className}`}>
            <span className={`flex items-center 2xl:tracking-[4px] tracking-[2px] font-semibold`}>{text}</span>
            {icon && <HiOutlineArrowLongRight className='rtl:rotate-180' />}
        </Link>
    )
}
