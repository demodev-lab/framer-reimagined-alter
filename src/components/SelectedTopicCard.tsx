
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Button } from "./ui/button";
import { RefreshCw, Lock, X, ChevronDown } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { ScrollArea } from "./ui/scroll-area";

interface SelectedTopicCardProps {
  topic: string;
  subject: string;
  concept: string;
  topicNumber: number;
  isLocked: boolean;
  onRefresh: () => void;
  onLock: () => void;
  onDelete: () => void;
  onRegenerateMethods: () => void;
  topicType: string;
  onTopicTypeChange: (type: string) => void;
  researchMethods?: string[];
  isLoadingMethods?: boolean;
}

const SelectedTopicCard: React.FC<SelectedTopicCardProps> = ({
  topic,
  subject,
  concept,
  topicNumber,
  isLocked,
  onRefresh,
  onLock,
  onDelete,
  onRegenerateMethods,
  topicType,
  onTopicTypeChange,
  researchMethods = [],
  isLoadingMethods = false,
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>세특 주제 {topicNumber}</CardTitle>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="주제 재생성" disabled={isLocked}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>새로운 주제 생성</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onLock} aria-label={isLocked ? "주제 잠금 해제" : "주제 잠금"}>
                <Lock className={`h-4 w-4 ${isLocked ? "text-primary" : ""}`} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isLocked ? "주제 잠금 해제" : "주제 잠금"}</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onDelete} aria-label="주제 삭제" disabled={isLocked}>
                <X className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>주제 삭제</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" aria-label="주제 유형 선택" disabled={isLocked}>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>주제 유형 변경</p>
              </TooltipContent>
            </Tooltip>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={topicType}
                onValueChange={onTopicTypeChange}
              >
                <DropdownMenuRadioItem value="보고서 주제">
                  보고서 주제
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="실험 주제">
                  실험 주제
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="제작 주제">
                  제작 주제
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden min-h-0 flex flex-col">
        <ScrollArea className="flex-grow pr-4">
          <div>
            <p className="text-lg font-semibold">{topic}</p>
            <div className="border-t my-4" />
            <dl className="space-y-2">
              {subject && (
                <div className="flex">
                  <dt className="w-20 font-semibold text-muted-foreground shrink-0">교과 과목</dt>
                  <dd className="font-medium">{subject}</dd>
                </div>
              )}
              {concept && (
                <div className="flex">
                  <dt className="w-20 font-semibold text-muted-foreground shrink-0">교과 개념</dt>
                  <dd className="font-medium">{concept}</dd>
                </div>
              )}
              <div className="flex">
                <dt className="w-20 font-semibold text-muted-foreground shrink-0">주제 유형</dt>
                <dd className="font-medium">{topicType}</dd>
              </div>
            </dl>
          </div>
        </ScrollArea>
        
        {/* 탐구 방법 생성 버튼 */}
        <div className="flex justify-center mt-4 pt-4 border-t">
          <Button 
            onClick={onRegenerateMethods}
            className="bg-black text-white hover:bg-gray-800 px-6 py-2"
            disabled={isLocked || isLoadingMethods}
          >
            {isLoadingMethods ? "생성 중..." : "탐구 방법 생성"}
          </Button>
        </div>

        {/* 탐구 방법 표시 박스 */}
        {(researchMethods.length > 0 || isLoadingMethods) && (
          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-semibold mb-3 text-center">탐구 방법</h4>
            {isLoadingMethods ? (
              <div className="text-center text-muted-foreground">탐구 방법을 생성하고 있습니다...</div>
            ) : (
              <div className="space-y-3">
                {researchMethods.map((method, index) => (
                  <div key={index} className="p-3 bg-white rounded border text-sm">
                    <span className="font-medium text-primary">{index + 1}. </span>
                    {method}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SelectedTopicCard;
