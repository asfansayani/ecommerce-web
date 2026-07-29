import Image from "next/image";
import Hero from "@/app/components/home/Hero";
import Categories from "@/app/components/home/Categories";
import Products from "@/app/components/home/Products";
import About from "@/app/components/home/About";
import Social from "@/app/components/home/Social";
import Quote from "@/app/components/home/Quote";

export default function Home() {
  return (
    <>
    <Hero />
    <Categories />
    <Products />
    <About />
    <Products />
    <Social />
    <Quote />
    </>
  );
}
