
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCarousel } from "@/components/ui/carousel";

interface CarouselControlsProps {
  groupId: number;
  canAddFollowUp: boolean;
  onAddFollowUp: (groupId: number) => void;
}

const CarouselControls: React.FC<CarouselControlsProps> = ({
  groupId,
  canAddFollowUp,
  onAddFollowUp
}) => {
  const { scrollPrev, scrollNext, canScrollPrev, canScrollNext } = useCarousel();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="absolute -left-20 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
        disabled={!canScrollPrev}
        onClick={scrollPrev}
      >
        <ArrowLeft className="h-4 w-4" />
        <span className="sr-only">Previous slide</span>
      </Button>
      
      {canScrollNext ? (
        <Button
          variant="outline"
          size="icon"
          className="absolute -right-20 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
          disabled={!canScrollNext}
          onClick={scrollNext}
        >
          <ArrowRight className="h-4 w-4" />
          <span className="sr-only">Next slide</span>
        </Button>
      ) : canAddFollowUp ? (
        <Button
          className="absolute -right-20 top-1/2 -translate-y-1/2 h-12 w-12 rounded-md flex flex-col items-center justify-center text-xs font-medium p-1 bg-black text-white hover:bg-gray-800 border-black"
          onClick={() => onAddFollowUp(groupId)}
        >
          <span className="leading-none">후속</span>
          <span className="leading-none">심화</span>
        </Button>
      ) : null}
    </>
  );
};

export default CarouselControls;
