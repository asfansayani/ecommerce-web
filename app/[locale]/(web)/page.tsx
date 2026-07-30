import Image from "next/image";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import Products from "@/components/home/Products";
import About from "@/components/home/About";
import Social from "@/components/home/Social";
import Quote from "@/components/home/Quote";

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
