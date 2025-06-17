
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, ChevronRight } from "lucide-react";
import React from "react";

interface ResearchMethodsCardProps {
  researchMethods: string[];
  isLoading: boolean;
}

const ResearchMethodsCard: React.FC<ResearchMethodsCardProps> = ({
  researchMethods,
  isLoading,
}) => {
  const handleRegenerate = () => {
    console.log("재생성 버튼 클릭");
  };

  const handleMoreDetails = () => {
    console.log("더 자세히 버튼 클릭");
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>탐구 방법</CardTitle>
        <div className="flex gap-2">
          <Button 
            onClick={handleRegenerate}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            disabled={isLoading}
          >
            <RefreshCw className="h-4 w-4" />
            재생성
          </Button>
          <Button 
            onClick={handleMoreDetails}
            size="sm"
            className="flex items-center gap-2 bg-black text-white hover:bg-gray-800"
            disabled={isLoading}
          >
            <ChevronRight className="h-4 w-4" />
            더 자세히
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
