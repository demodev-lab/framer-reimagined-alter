
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

interface ResearchMethodsCardProps {
  researchMethods: string[];
  isLoading: boolean;
}

const ResearchMethodsCard: React.FC<ResearchMethodsCardProps> = ({
  researchMethods,
  isLoading,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>탐구 방법</CardTitle>
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
