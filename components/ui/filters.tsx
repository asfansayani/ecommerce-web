"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const COLORS = [
  { value: "amber", className: "bg-amber-400" },
  { value: "black", className: "bg-black" },
  { value: "gray", className: "bg-gray-500" },
  { value: "blue", className: "bg-blue-500" },
  { value: "green", className: "bg-green-500" },
  { value: "purple", className: "bg-purple-500" },
  { value: "red", className: "bg-red-500" },
  { value: "orange", className: "bg-orange-500" },
  { value: "pink", className: "bg-pink-500" },
  { value: "teal", className: "bg-teal-500" },
] as const;

const SIZES = [
  { value: "xx-small", label: "XX-Small" },
  { value: "x-small", label: "X-Small" },
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
  { value: "x-large", label: "X-Large" },
  { value: "xx-large", label: "XX-Large" },
] as const;

export default function Filters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedColor = searchParams.get("color") ?? "";
  const selectedSize = searchParams.get("size") ?? "";

  function updateFilter(key: "color" | "size", value: string | null) {
    const params = new URLSearchParams(searchParams.toString());

    if (!value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    params.set("page", "1");

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  return (
    <div className="border rounded-2xl p-5">
      <h3 className="text-lg font-medium pb-3">Filters</h3>
      <div className="max-h-[calc(100vh-8rem)] overflow-y-auto no-scrollbar divide-y divide-gray-200">
        <div className="py-3">
          <ul className="text-sm text-gray-500 space-y-2">
            <li>
              <Link href="/shop/collections/all">T-Shirts</Link>
            </li>
            <li>
              <Link href="/shop/collections/all">Hoodies</Link>
            </li>
            <li>
              <Link href="/shop/collections/all">Sweatshirts</Link>
            </li>
            <li>
              <Link href="/shop/collections/all">Jackets</Link>
            </li>
            <li>
              <Link href="/shop/collections/all">Pants</Link>
            </li>
            <li>
              <Link href="/shop/collections/all">Shoes</Link>
            </li>
          </ul>
        </div>

        <div className="py-3">
          <Accordion defaultValue={["colors"]} className="max-w-lg">
            <AccordionItem value="colors">
              <AccordionTrigger>Colors</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedColor}
                  onValueChange={(value) => updateFilter("color", value)}
                  className="w-fit flex flex-wrap pt-2"
                >
                  {COLORS.map((color, index) => (
                    <div key={color.value} className="flex items-center">
                      <RadioGroupItem
                        value={color.value}
                        id={`color-${index}`}
                        className="sr-only size-0 border-0 absolute"
                      />
                      <Label
                        htmlFor={`color-${index}`}
                        className={`${color.className} border border-black/20 w-7 h-7 rounded-full cursor-pointer peer-data-checked:border-black peer-data-checked:ring-2 peer-data-checked:ring-black peer-data-checked:ring-offset-1`}
                      />
                    </div>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <div className="py-3">
          <Accordion defaultValue={["sizes"]} className="max-w-lg">
            <AccordionItem value="sizes">
              <AccordionTrigger>Size</AccordionTrigger>
              <AccordionContent>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={(value) => updateFilter("size", value)}
                  className="w-fit flex flex-wrap"
                >
                  {SIZES.map((size, index) => (
                    <div key={size.value} className="flex items-center">
                      <RadioGroupItem
                        value={size.value}
                        id={`size-${index}`}
                        className="sr-only size-0 border-0 absolute"
                      />
                      <Label
                        htmlFor={`size-${index}`}
                        className="bg-[#F0F0F0] rounded-full cursor-pointer peer-data-checked:bg-black peer-data-checked:text-white py-2 px-4"
                      >
                        {size.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
