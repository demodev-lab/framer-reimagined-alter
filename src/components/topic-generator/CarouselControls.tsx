
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              className="absolute -right-20 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-xs font-medium"
              onClick={() => onAddFollowUp(groupId)}
            >
              후속
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>후속 심화 탐구 만들기</p>
          </TooltipContent>
        </Tooltip>
      ) : null}
    </>
  );
};

export default CarouselControls;
