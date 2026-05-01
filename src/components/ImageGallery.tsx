"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { optimizeImageUrl } from "@/lib/images";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
  title?: string;
  description?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  defaultIndex?: number;
  showThumbnails?: boolean;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
  onClose?: () => void;
}

export function ImageGallery({
  images,
  defaultIndex = 0,
  showThumbnails = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  className = "",
  onClose,
}: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(defaultIndex);
  const [isAutoPlaying, setIsAutoPlaying] = useState(autoPlay);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isAutoPlaying, images.length, autoPlayInterval]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
  };

  const currentImage = images[currentIndex];

  return (
    <div className={`relative w-full ${className}`}>
      {/* Main Image Display */}
      <div className="relative w-full aspect-video md:aspect-[16/10] bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl overflow-hidden group">
        <Image
          src={optimizeImageUrl(currentImage.src, 1200, 700)}
          alt={currentImage.alt}
          fill
          className="object-cover transition-opacity duration-500"
          priority
        />

        {/* Image Overlay Info */}
        {currentImage.title && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {currentImage.title}
            </h3>
            {currentImage.description && (
              <p className="text-sm md:text-base text-white/80">
                {currentImage.description}
              </p>
            )}
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full
                bg-white/20 hover:bg-white/40 text-white transition-all duration-300
                opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full
                bg-white/20 hover:bg-white/40 text-white transition-all duration-300
                opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full
              bg-white/20 hover:bg-white/40 text-white transition-all duration-300"
            aria-label="Close gallery"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 rounded-full
            text-white text-sm font-semibold">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {showThumbnails && images.length > 1 && (
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden
                transition-all duration-300 border-2
                ${
                  index === currentIndex
                    ? "border-gold scale-105"
                    : "border-slate-300 dark:border-slate-600 opacity-60 hover:opacity-100"
                }`}
              aria-label={`Go to slide ${index + 1}`}
            >
              <Image
                src={optimizeImageUrl(image.src, 100, 100)}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Progress Bar */}
      {isAutoPlaying && (
        <div className="mt-4 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 transition-all duration-1000"
            style={{
              width: `${((currentIndex + 1) / images.length) * 100}%`,
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageGallery;
