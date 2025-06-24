
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface CareerSentenceSectionProps {
  selectedCareerSentence: string | null;
  onRegenerateCareerSentence: () => void;
}

const CareerSentenceSection: React.FC<CareerSentenceSectionProps> = ({
  selectedCareerSentence,
  onRegenerateCareerSentence
}) => {
  if (!selectedCareerSentence) return null;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold text-center text-green-800 mb-1">진로 문장</p>
            <p className="text-center text-green-700">{selectedCareerSentence}</p>
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onRegenerateCareerSentence} 
                className="flex-shrink-0 h-8 w-8 p-0 hover:bg-green-100"
              >
                <RefreshCw className="h-4 w-4 text-green-600" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>진로 문장 재생성</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default CareerSentenceSection;
