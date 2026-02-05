import { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { ImageWithFallback } from "@/app/components/figma/ImageWithFallback";

interface ImageCarouselProps {
  images: string[];
  alt: string;
  aspectRatio?: string;
}

export function ImageCarousel({ images, alt, aspectRatio = "aspect-[4/3]" }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  // Listen to select events
  useState(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  });

  if (images.length === 0) return null;

  return (
    <div className="relative group">
      <div className={`${aspectRatio} w-full overflow-hidden bg-gray-100`} ref={emblaRef}>
        <div className="flex h-full">
          {images.map((image, index) => (
            <div key={index} className="relative flex-[0_0_100%] min-w-0">
              <ImageWithFallback
                src={image}
                alt={`${alt} - ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {images.length > 1 && (
        <>
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollPrev}
          >
            <ChevronLeft className="size-4 sm:size-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={scrollNext}
          >
            <ChevronRight className="size-4 sm:size-5" />
          </Button>

          {/* Dots Indicator */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                className={`size-1.5 sm:size-2 rounded-full transition-all ${
                  index === selectedIndex
                    ? "bg-white w-4 sm:w-6"
                    : "bg-white/60 hover:bg-white/80"
                }`}
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
