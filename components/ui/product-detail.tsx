"use client"
import { RadioGroup } from "@base-ui/react/radio-group";
import Image from "next/image";
import { RadioGroupItem } from "./radio-group";
import { ApiProduct } from "@/types/product";
import { Label } from "./label";
import { MinusIcon, PlusIcon } from "lucide-react";
import { Button } from "./button";
import RelatedProducts from "../website/related-products";
export default function ProductDetail({ slug, product, relatedProducts }: { slug: string, product: ApiProduct, relatedProducts: ApiProduct[] }) {

  return (
    <>
      <div className='container grid grid-cols-1 md:grid-cols-2 items-start gap-10 mt-10 relative'>
        <div className="col-span-1 sticky top-5">
          <Image src={product?.imageUrls?.[0] || ''} alt={product?.name || ''} width={500} height={500} className="w-full max-h-125 object-cover" />
        </div>
        <div className="col-span-1 space-y-3 sticky top-5">
          <h1 className="text-2xl font-extrabold uppercase">{"One Life Graphic T-shirt"}</h1>
          <div className="flex items-center gap-2">
            <h5 className="text-2xl font-semibold">{"$260"} <span className="text-gray-400 line-through">{"$320"}</span>
            </h5>
            <span className="text-red-500 bg-red-500/10 px-3 py-1 rounded-full text-sm font-medium">{"-20%"}</span>
          </div>
          <p className="text-gray-500 max-xl:text-sm">{'This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.'}</p>
          <div className="pt-3 pb-4 border-y">
            <h6 className="text-black/60 text-sm mb-2">Select Colors</h6>
            <RadioGroup
              value={"red"}
              onValueChange={(value) => console.log(value)}
              className="w-fit flex flex-wrap pt-2 gap-5"
            >
              <div>
                <RadioGroupItem value="red" id="red" className="sr-only size-0 border-0 absolute" />
                <Label htmlFor="red" className="bg-[#4F4631] border border-black/20 w-8 h-8 rounded-full cursor-pointer peer-data-checked:border-black peer-data-checked:ring-2 peer-data-checked:ring-black peer-data-checked:ring-offset-1" />
              </div>
              <div>
                <RadioGroupItem value="blue" id="blue" className="sr-only size-0 border-0 absolute" />
                <Label htmlFor="blue" className="bg-[#314F4A] border border-black/20 w-8 h-8 rounded-full cursor-pointer peer-data-checked:border-black peer-data-checked:ring-2 peer-data-checked:ring-black peer-data-checked:ring-offset-1" />
              </div>
              <div>
                <RadioGroupItem value="green" id="green" className="sr-only size-0 border-0 absolute" />
                <Label htmlFor="green" className="bg-[#31344F] border border-black/20 w-8 h-8 rounded-full cursor-pointer peer-data-checked:border-black peer-data-checked:ring-2 peer-data-checked:ring-black peer-data-checked:ring-offset-1" />
              </div>
            </RadioGroup>
          </div>
          <div className="pb-4 border-b">
            <h6 className="text-black/60 text-sm">Select Size</h6>
            <RadioGroup
              value={"small"}
              onValueChange={(value) => console.log(value)}
              className="w-fit flex flex-wrap pt-2 gap-2"
            >
              <div>
                <RadioGroupItem value="small" id="small" className="sr-only size-0 border-0 absolute" />
                <Label
                  htmlFor={"small"}
                  className="bg-[#F0F0F0] text-black/60 rounded-full cursor-pointer peer-data-checked:bg-black peer-data-checked:text-white py-3 px-5"
                >
                  {"Small"}
                </Label>
              </div>
              <div>
                <RadioGroupItem value="medium" id="medium" className="sr-only size-0 border-0 absolute" />
                <Label
                  htmlFor={"medium"}
                  className="bg-[#F0F0F0] text-black/60 rounded-full cursor-pointer peer-data-checked:bg-black peer-data-checked:text-white py-3 px-5"
                >
                  {"Medium"}
                </Label>
              </div>
              <div>
                <RadioGroupItem value="large" id="large" className="sr-only size-0 border-0 absolute" />
                <Label
                  htmlFor={"large"}
                  className="bg-[#F0F0F0] text-black/60 rounded-full cursor-pointer peer-data-checked:bg-black peer-data-checked:text-white py-3 px-5"
                >
                  {"Large"}
                </Label>
              </div>
              <div>
                <RadioGroupItem value="extra-large" id="extra-large" className="sr-only size-0 border-0 absolute" />
                <Label
                  htmlFor={"extra-large"}
                  className="bg-[#F0F0F0] text-black/60 rounded-full cursor-pointer peer-data-checked:bg-black peer-data-checked:text-white py-3 px-5"
                >
                  {"X-Large"}
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="flex gap-5">
            <div className="flex items-center gap-5 bg-[#F0F0F0] rounded-full">
              <button type="button" className="p-3">
                <MinusIcon className="w-4 h-4" />
              </button>
              <span className="text-black/60 text-sm">1</span>
              <button type="button" className="p-3">
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>
            <Button className="flex-1 rounded-full md:h-11">
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
      <RelatedProducts relatedProducts={relatedProducts} />
    </>
  )
}
