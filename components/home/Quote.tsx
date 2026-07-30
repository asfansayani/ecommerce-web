import SecHd from '@/components/custom-ui/SecHd'
import Image from 'next/image'

export default function Quote() {
    return (
        <section className="2xl:py-25 lg:py-15 py-10 bg-[#FCFAF7] text-center">
            <div className='2xl:max-w-300 max-w-200 mx-auto'>
                <Image src="/assets/images/sparkle.png" alt="quote" width={28} height={28} className='mx-auto max-2xl:w-5 max-2xl:h-5' />
                <SecHd className='mt-10 mb-8'
                    text={`"Jewelry is the most intimate form of art we possess — a quiet conversation between the body and the object."`} />
                <span className='text-[#A37C43] max-2xl:text-[12px] uppercase 2xl:tracking-[4px] tracking-[2px]'>— {"The Bijou Sky Atelier"}</span>
            </div>
        </section>
    )
}
