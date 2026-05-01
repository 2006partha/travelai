"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getPlaceholderGradient, optimizeImageUrl } from "@/lib/images";

interface ImageCardProps {
  src?: string;
  alt: string;
  title?: string;
  subtitle?: string;
  overlay?: boolean;
  overlayGradient?: boolean;
  href?: string;
  onClick?: () => void;
  className?: string;
  imageClassName?: string;
  contentClassName?: string;
  priority?: boolean;
  fill?: boolean;
  height?: number;
  width?: number;
  children?: React.ReactNode;
}

export function ImageCard({
  src,
  alt,
  title,
  subtitle,
  overlay = true,
  overlayGradient = true,
  href,
  onClick,
  className = "",
  imageClassName = "",
  contentClassName = "",
  priority = false,
  fill = true,
  height,
  width,
  children,
}: ImageCardProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const placeholderGradient = getPlaceholderGradient(alt);

  const containerClasses = `
    relative group overflow-hidden rounded-2xl
    ${href ? "cursor-pointer" : ""}
    ${className}
  `.trim();

  const imageContainerClasses = `
    relative w-full h-full
    ${overlayGradient && overlay ? overlayGradient : ""}
  `.trim();

  const overlayClasses = `
    absolute inset-0 bg-gradient-to-b from-transparent via-transparent
    to-black/50 dark:to-black/70 group-hover:to-black/60
    dark:group-hover:to-black/80 transition-colors duration-300
    ${overlay ? "" : "hidden"}
  `.trim();

  const contentClasses = `
    absolute inset-0 flex flex-col justify-end p-6 md:p-8
    text-white transition-transform duration-300
    ${href || onClick ? "group-hover:translate-y-0" : ""}
    ${contentClassName}
  `.trim();

  const handleClick = () => {
    if (href) {
      window.location.href = href;
    }
    onClick?.();
  };

  return (
    <div
      className={containerClasses}
      onClick={handleClick}
      role={href ? "link" : "img"}
      tabIndex={href || onClick ? 0 : -1}
      onKeyDown={(e) => {
        if ((href || onClick) && (e.key === "Enter" || e.key === " ")) {
          handleClick();
        }
      }}
    >
      {/* Loading Placeholder */}
      {isLoading && (
        <div
          className={`absolute inset-0 bg-gradient-to-br ${placeholderGradient} animate-pulse`}
        />
      )}

      {/* Image Container */}
      <div className={imageContainerClasses}>
        {src && !imageError ? (
          fill ? (
            <Image
              src={optimizeImageUrl(src, width || 600, height)}
              alt={alt}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                isLoading ? "opacity-0" : "opacity-100"
              } ${imageClassName}`}
              priority={priority}
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => {
                setImageError(true);
                setIsLoading(false);
              }}
            />
          ) : (
            <Image
              src={optimizeImageUrl(src, width || 600, height)}
              alt={alt}
              width={width || 600}
              height={height || 400}
              className={`object-cover w-full h-full transition-transform duration-500 group-hover:scale-110 ${
                isLoading ? "opacity-0" : "opacity-100"
              } ${imageClassName}`}
              priority={priority}
              onLoadingComplete={() => setIsLoading(false)}
              onError={() => {
                setImageError(true);
                setIsLoading(false);
              }}
            />
          )
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${placeholderGradient}`} />
        )}
      </div>

      {/* Overlay */}
      <div className={overlayClasses} />

      {/* Content */}
      <div className={contentClasses}>
        {title && (
          <h3 className="text-2xl md:text-3xl font-bold font-display mb-2 drop-shadow-lg">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm md:text-base text-white/90 drop-shadow-md mb-4">
            {subtitle}
          </p>
        )}
        {children}
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/20 transition-colors duration-300 pointer-events-none" />
    </div>
  );
}

export default ImageCard;
