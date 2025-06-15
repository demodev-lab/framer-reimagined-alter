
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Button } from "./ui/button";
import { RefreshCw, Lock, X, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";

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
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>세특 주제 {topicNumber}</CardTitle>
        <div className="flex gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRefresh} aria-label="주제 새로고침" disabled={isLocked}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>주제 목록으로 돌아가기</p>
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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onRegenerateMethods} aria-label="탐구 방법 다시 생성">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>탐구 방법 다시 생성</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow">
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
          </dl>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground mb-2">주제 유형</p>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={topicType}
            onValueChange={(value) => {
              if (value) onTopicTypeChange(value);
            }}
            className="flex-wrap justify-start"
            disabled={isLocked}
          >
            <ToggleGroupItem value="보고서 주제" aria-label="보고서 주제">
              보고서 주제
            </ToggleGroupItem>
            <ToggleGroupItem value="실험 주제" aria-label="실험 주제">
              실험 주제
            </ToggleGroupItem>
            <ToggleGroupItem value="제작 주제" aria-label="제작 주제">
              제작 주제
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedTopicCard;
