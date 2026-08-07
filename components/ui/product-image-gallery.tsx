"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import ImageLightbox from "./image-lightbox";

import "swiper/css";

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
  onActiveImageChange?: (imageUrl: string, index: number) => void;
};

function ProductImageGalleryInner({
  images,
  alt,
  onActiveImageChange,
}: {
  images: string[];
  alt: string;
  onActiveImageChange?: (imageUrl: string, index: number) => void;
}) {
  const mainSwiperRef = useRef<SwiperType | null>(null);
  const onActiveImageChangeRef = useRef(onActiveImageChange);
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const showThumbs = images.length > 1;

  useEffect(() => {
    onActiveImageChangeRef.current = onActiveImageChange;
  }, [onActiveImageChange]);

  useEffect(() => {
    setActiveIndex(0);
    mainSwiperRef.current?.slideTo(0, 0);
    onActiveImageChangeRef.current?.(images[0], 0);
  }, [images]);

  const selectImage = (index: number) => {
    setActiveIndex(index);
    mainSwiperRef.current?.slideTo(index);
    onActiveImageChangeRef.current?.(images[index], index);
  };

  const updateActive = (index: number) => {
    setActiveIndex(index);
    onActiveImageChangeRef.current?.(images[index], index);
  };

  return (
    <>
      <div
        className={
          showThumbs
            ? "grid grid-cols-[4rem_minmax(0,1fr)] gap-3 sm:grid-cols-[5rem_minmax(0,1fr)] md:grid-cols-[6rem_minmax(0,1fr)]"
            : "grid grid-cols-1"
        }
      >
        {showThumbs ? (
          <div className="flex max-h-[min(500px,70vw)] flex-col gap-2.5 overflow-y-auto">
            {images.map((url, index) => (
              <button
                key={`thumb-${index}`}
                type="button"
                onClick={() => selectImage(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={activeIndex === index}
                className={`relative aspect-square w-full shrink-0 overflow-hidden border transition-colors ${
                  activeIndex === index
                    ? "border-black"
                    : "border-transparent hover:border-black/30"
                }`}
              >
                <Image
                  src={url}
                  alt={`${alt} thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </button>
            ))}
          </div>
        ) : null}

        <Swiper
          onSwiper={(swiper) => {
            mainSwiperRef.current = swiper;
          }}
          onSlideChange={(swiper) => updateActive(swiper.activeIndex)}
          spaceBetween={10}
          className="min-w-0 w-full"
        >
          {images.map((url, index) => (
            <SwiperSlide key={`main-${index}`}>
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label={`Open ${alt} image gallery`}
                className="relative aspect-square w-full cursor-zoom-in overflow-hidden bg-[#F9F6F2] text-start"
              >
                <Image
                  src={url}
                  alt={`${alt} ${index + 1}`}
                  fill
                  className="object-cover transition duration-300 hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority={index === 0}
                />
              </button>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <ImageLightbox
        images={images}
        alt={alt}
        open={lightboxOpen}
        startIndex={activeIndex}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={(index) => {
          updateActive(index);
          mainSwiperRef.current?.slideTo(index, 0);
        }}
      />
    </>
  );
}

export default function ProductImageGallery({
  images,
  alt,
  onActiveImageChange,
}: ProductImageGalleryProps) {
  const galleryImages =
    images.length > 0 ? images : ["/assets/images/productImage.svg"];

  return (
    <ProductImageGalleryInner
      key={galleryImages.join("|")}
      images={galleryImages}
      alt={alt}
      onActiveImageChange={onActiveImageChange}
    />
  );
}
