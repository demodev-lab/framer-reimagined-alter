
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RotateCcw, ChevronLeft, ChevronRight, ArrowLeft, Archive } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import React, { useState } from "react";

interface TopicDetail {
  id: number;
  주제명: string;
  탐구_주제_요약?: string;
  실현_가능성?: string;
}

interface TopicResultsCardProps {
  title: string;
  placeholder: string;
  topics: string[];
  onSelectTopic: (topic: string) => void;
  isLoading: boolean;
  isSelectable?: boolean;
  scrollable?: boolean;
  onBack?: () => void;
  // 상세 모드를 위한 추가 props
  detailedTopics?: TopicDetail[];
  showDetailedView?: boolean;
  // 탐구 방법 관련 props
  onGenerateResearchMethod?: (topic: string) => void;
  onBackToTopicList?: () => void;
  isLoadingResearchMethod?: boolean;
  researchMethods?: string[];
}

const TopicResultsCard: React.FC<TopicResultsCardProps> = ({
  title,
  placeholder,
  topics,
  onSelectTopic,
  isLoading,
  isSelectable = true,
  scrollable = true,
  onBack,
  detailedTopics,
  showDetailedView = false,
  onGenerateResearchMethod,
  onBackToTopicList,
  isLoadingResearchMethod = false,
  researchMethods = [],
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // 캐러셀에 표시할 데이터 결정
  const carouselData = showDetailedView && detailedTopics ? detailedTopics : topics.map((topic, index) => ({ id: index, 주제명: topic }));
  const totalItems = carouselData.length;
  
  // 네비게이션 핸들러
  const goToPrevious = () => {
    setCurrentIndex(prev => (prev - 1 + totalItems) % totalItems);
  };
  
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % totalItems);
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  // 캐러셀 렌더링 함수
  const renderCarouselContent = () => {
    if (totalItems === 0) return null;
    
    const currentItem = carouselData[currentIndex];
    
    if (showDetailedView && detailedTopics) {
      return (
        <Button
          variant="outline"
          className="inline-flex items-center gap-2 rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border bg-background text-foreground border-foreground hover:bg-foreground hover:text-background dark:bg-primary dark:text-primary-foreground dark:border-primary dark:hover:bg-primary-foreground dark:hover:text-primary px-4 justify-start text-left h-auto whitespace-normal py-2 w-full"
          onClick={() => isSelectable && onSelectTopic(currentItem.주제명)}
          disabled={!isSelectable}
        >
          <div className="flex flex-col gap-4 w-full">
            {/* 주제명 섹션 */}
            <div className="border-l-4 border-blue-500 pl-3">
              <div className="font-bold text-base text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-blue-600">📋</span>
                주제명
              </div>
              <div className="text-sm text-gray-700 bg-blue-50 p-3 rounded-md border border-blue-100">
                {currentItem.주제명}
              </div>
            </div>
            
            {/* 탐구 주제 요약 섹션 */}
            <div className="border-l-4 border-green-500 pl-3">
              <div className="font-bold text-base text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-green-600">💡</span>
                탐구 주제 요약
              </div>
              <div className="text-sm text-gray-700 bg-green-50 p-3 rounded-md border border-green-100 leading-relaxed">
                {currentItem.탐구_주제_요약 || '요약 정보가 없습니다.'}
              </div>
            </div>
            
            {/* 실현 가능성 섹션 */}
            <div className="border-l-4 border-orange-500 pl-3">
              <div className="font-bold text-base text-gray-800 mb-2 flex items-center gap-2">
                <span className="text-orange-600">⚡</span>
                실현 가능성
              </div>
              <div className="text-sm text-gray-700 bg-orange-50 p-3 rounded-md border border-orange-100">
                {currentItem.실현_가능성 || '실현 가능성 정보가 없습니다.'}
              </div>
            </div>
          </div>
        </Button>
      );
    } else {
      return (
        <Button
          variant="outline"
          className="justify-start text-left h-auto whitespace-normal py-2 w-full"
          onClick={() => isSelectable && onSelectTopic(currentItem.주제명)}
          disabled={!isSelectable}
        >
          {currentItem.주제명}
        </Button>
      );
    }
  };

  const carouselContent = (
    <div className="relative">
      {/* 컨트롤 바 */}
      <div className="flex items-center gap-3 mb-4">
        {/* 왼쪽 화살표 버튼 - 주제 목록으로 돌아가기 */}
        {onBackToTopicList && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={onBackToTopicList}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                aria-label="주제 목록으로 돌아가기"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>주제 목록으로 돌아가기</p>
            </TooltipContent>
          </Tooltip>
        )}
        
        {/* 메인 컨텐츠 */}
        <div className="flex-1">
          {renderCarouselContent()}
        </div>
        
      </div>
      
      {/* 탐구 방법 영역 */}
      {(isLoadingResearchMethod || researchMethods.length > 0) && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-sm mb-3 text-gray-800">탐구 방법</h4>
          {isLoadingResearchMethod ? (
            <div className="space-y-3">
              <div className="animate-pulse rounded-md bg-muted h-4 w-full"></div>
              <div className="animate-pulse rounded-md bg-muted h-4 w-full"></div>
              <div className="animate-pulse rounded-md bg-muted h-4 w-3/4"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {researchMethods.map((method, index) => (
                <div key={index} className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                  {method}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* 네비게이션 컨트롤 */}
      {totalItems > 1 && (
        <div className="flex items-center justify-between">
          {/* 이전 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToPrevious}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="h-4 w-4" />
            이전
          </Button>
          
          {/* 인디케이터 */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {currentIndex + 1} / {totalItems}
            </span>
            <div className="flex gap-1">
              {Array.from({ length: totalItems }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* 다음 버튼 */}
          <Button
            variant="outline"
            size="sm"
            onClick={goToNext}
            className="flex items-center gap-2"
          >
            다음
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="relative flex flex-col items-center">
        {onBack && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onBack} 
                aria-label="주제 재생성"
                className="absolute left-5 top-6"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>주제 재생성</p>
            </TooltipContent>
          </Tooltip>
        )}
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p>생성 중...</p>
          </div>
        ) : totalItems === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center">{placeholder}</p>
          </div>
        ) : (
          <div className="h-full overflow-y-auto">
            {carouselContent}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TopicResultsCard;
