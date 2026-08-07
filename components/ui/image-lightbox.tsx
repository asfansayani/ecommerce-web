"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Keyboard, Navigation, Pagination, Zoom } from "swiper/modules";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";

type ImageLightboxProps = {
  images: string[];
  alt: string;
  startIndex?: number;
  open: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
};

const CLOSE_MS = 300;

export default function ImageLightbox({
  images,
  alt,
  startIndex = 0,
  open,
  onClose,
  onIndexChange,
}: ImageLightboxProps) {
  const [mounted, setMounted] = useState(false);
  const [rendered, setRendered] = useState(false);
  const [visible, setVisible] = useState(false);
  const [swiper, setSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(startIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setRendered(true);
      setActiveIndex(startIndex);
      setIsZoomed(false);
      const showId = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        cancelAnimationFrame(showId);
        document.body.style.overflow = prevOverflow;
      };
    }

    setVisible(false);
    const hideId = window.setTimeout(() => setRendered(false), CLOSE_MS);
    return () => window.clearTimeout(hideId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (open) {
      setActiveIndex(startIndex);
    }
  }, [open, startIndex]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !rendered || images.length === 0) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${alt} image gallery`}
      className={`fixed inset-0 z-[9999] flex flex-col bg-white transition-opacity duration-300 ease-out ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      onClick={onClose}
    >
      <div
        className={`relative flex h-full w-full flex-col transition-transform duration-300 ease-out ${
          visible ? "translate-y-0 scale-100" : "translate-y-2 scale-[0.98]"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative z-10 flex items-center justify-between gap-3 border-b border-black/5 px-4 py-3 sm:px-6">
          <p className="text-sm text-black/60">
            {activeIndex + 1} / {images.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              aria-label="Zoom out"
              onClick={() => {
                swiper?.zoom?.out();
                setIsZoomed(false);
              }}
              disabled={!isZoomed}
              className="rounded-full p-2 text-black/70 transition hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ZoomOut className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Zoom in"
              onClick={() => {
                swiper?.zoom?.in();
                setIsZoomed(true);
              }}
              disabled={isZoomed}
              className="rounded-full p-2 text-black/70 transition hover:bg-black/5 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ZoomIn className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Close lightbox"
              onClick={onClose}
              className="rounded-full p-2 text-black/70 transition hover:bg-black/5 hover:text-black"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1">
          {images.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                className="lightbox-prev absolute start-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-black/10 bg-white p-2 text-black shadow-sm transition hover:bg-black/5 sm:start-4"
              >
                <ChevronLeft className="size-6" />
              </button>
              <button
                type="button"
                aria-label="Next image"
                className="lightbox-next absolute end-2 top-1/2 z-20 -translate-y-1/2 rounded-full border border-black/10 bg-white p-2 text-black shadow-sm transition hover:bg-black/5 sm:end-4"
              >
                <ChevronRight className="size-6" />
              </button>
            </>
          ) : null}

          <Swiper
            initialSlide={startIndex}
            modules={[Zoom, Navigation, Keyboard, Pagination]}
            zoom={{ maxRatio: 3, minRatio: 1 }}
            keyboard={{ enabled: true }}
            slidesPerView={1}
            spaceBetween={0}
            speed={500}
            resistanceRatio={0.75}
            navigation={
              images.length > 1
                ? {
                    prevEl: ".lightbox-prev",
                    nextEl: ".lightbox-next",
                  }
                : false
            }
            pagination={
              images.length > 1
                ? {
                    clickable: true,
                    dynamicBullets: true,
                  }
                : false
            }
            onSwiper={(instance) => {
              setSwiper(instance);
              // ensure start slide is correct after init
              if (startIndex > 0) {
                instance.slideTo(startIndex, 0);
              }
            }}
            onSlideChange={(s) => {
              setActiveIndex(s.activeIndex);
              setIsZoomed(false);
              s.zoom?.out();
              onIndexChange?.(s.activeIndex);
            }}
            onZoomChange={(_, scale) => setIsZoomed(scale > 1.05)}
            className="lightbox-swiper h-full w-full [--swiper-pagination-bullet-inactive-color:#000] [--swiper-pagination-bullet-inactive-opacity:0.25] [--swiper-pagination-color:#000] [&_.swiper-slide]:h-full [&_.swiper-slide]:overflow-hidden [&_.swiper-wrapper]:ease-[cubic-bezier(0.22,1,0.36,1)] [&_.swiper-pagination]:!bottom-3"
          >
            {images.map((url, index) => (
              <SwiperSlide
                key={`${url}-${index}`}
                className="!flex h-full w-full items-center justify-center"
              >
                <div className="swiper-zoom-container flex h-full w-full items-center justify-center px-12 py-6 sm:px-16">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`${alt} ${index + 1}`}
                    className="max-h-full max-w-full select-none object-contain"
                    draggable={false}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <p className="border-t border-black/5 py-3 text-center text-xs text-black/40">
          Double-tap or use buttons to zoom · Esc to close
        </p>
      </div>
    </div>,
    document.body
  );
}
