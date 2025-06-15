
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Button } from "./ui/button";
import { RefreshCw, Lock, X, Settings } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
      <CardContent className="flex-grow">
        <div>
          <p className="text-lg font-semibold">{topic}</p>
          {(subject || concept) && (
            <>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedTopicCard;

