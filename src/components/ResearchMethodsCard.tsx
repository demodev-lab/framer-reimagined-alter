
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react";
import React from "react";

interface ResearchMethodsCardProps {
  researchMethods: string[];
  isLoading: boolean;
}

const ResearchMethodsCard: React.FC<ResearchMethodsCardProps> = ({
  researchMethods,
  isLoading,
}) => {
  const handleIncreaseDifficulty = () => {
    console.log("난이도 증가 버튼 클릭");
  };

  const handleDecreaseDifficulty = () => {
    console.log("난이도 감소 버튼 클릭");
  };

  const handleMoreDetails = () => {
    console.log("초등학생 수준 상세 설명 생성 버튼 클릭");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>탐구 방법</CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={handleDecreaseDifficulty}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={isLoading}
            title="난이도 낮추기"
          >
            난이도
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleIncreaseDifficulty}
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            disabled={isLoading}
            title="난이도 높이기"
          >
            난이도
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleMoreDetails}
            size="sm"
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
            title="초등학생도 할 수 있는 상세한 단계별 설명"
          >
            더 자세히
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="pr-4">
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-4">
              {researchMethods.map((method, index) => (
                <div key={index} className="text-sm leading-relaxed">
                  <span className="font-medium text-primary">{index + 1}. </span>
                  {method}
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResearchMethodsCard;
