
import React from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCw, Sparkles, AlertCircle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { formatCareerSentence, parseFormattedText } from '@/utils/textFormatter';
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CareerSentenceSectionProps {
  selectedCareerSentence: string | null;
  onRegenerateCareerSentence: () => void;
}

const CareerSentenceSection: React.FC<CareerSentenceSectionProps> = ({
  selectedCareerSentence,
  onRegenerateCareerSentence
}) => {
  // 진로문장이 없을 때 안내 UI 표시
  if (!selectedCareerSentence) {
    return (
      <div className="w-full max-w-4xl mx-auto mb-6">
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            <div className="flex items-center justify-between">
              <span>탐구 주제를 생성하려면 먼저 진로 문장을 생성해주세요.</span>
              <Button 
                onClick={onRegenerateCareerSentence}
                size="sm"
                variant="outline"
                className="ml-4 border-amber-300 hover:bg-amber-100"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                진로 문장 생성하기
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 진로 문장 자동 줄바꿈 처리
  const formattedCareerSentence = formatCareerSentence(selectedCareerSentence);
  const parsedCareerSentence = parseFormattedText(formattedCareerSentence);

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold text-center text-green-800 mb-1">진로 문장</p>
            <p className="text-center text-green-700">{parsedCareerSentence}</p>
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
