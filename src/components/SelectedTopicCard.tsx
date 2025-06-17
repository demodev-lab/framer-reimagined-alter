import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Button } from "./ui/button";
import { RefreshCw, Lock, X, ChevronDown, Archive } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useArchive } from "@/contexts/ArchiveContext";
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
  onGoBack?: () => void;
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
  onGoBack
}) => {
  const {
    saveTopic
  } = useArchive();
  const handleArchiveSave = () => {
    saveTopic({
      title: topic,
      subject,
      concept,
      topicType,
      researchMethods
    });
  };
  return <div className="flex flex-col h-full space-y-4">
      <Card className="flex-shrink-0">
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
                <DropdownMenuRadioGroup value={topicType} onValueChange={onTopicTypeChange}>
                  
                  
                  
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden min-h-0 flex flex-col">
          <div>
            <p className="text-lg font-semibold">{topic}</p>
            <div className="border-t my-4" />
            <dl className="space-y-2">
              {subject && <div className="flex">
                  <dt className="w-20 font-semibold text-muted-foreground shrink-0">교과 과목</dt>
                  <dd className="font-medium">{subject}</dd>
                </div>}
              {concept && <div className="flex">
                  <dt className="w-20 font-semibold text-muted-foreground shrink-0">교과 개념</dt>
                  <dd className="font-medium">{concept}</dd>
                </div>}
              <div className="flex">
                <dt className="w-20 font-semibold text-muted-foreground shrink-0">주제 유형</dt>
                <dd className="font-medium">{topicType}</dd>
              </div>
            </dl>
          </div>
          
          {/* 탐구 방법 생성 버튼과 아카이브 저장 버튼 */}
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
            <Button onClick={onRegenerateMethods} className="bg-black text-white hover:bg-gray-800 px-6 py-2" disabled={isLocked}>
              탐구 방법 생성
            </Button>
            <Button onClick={handleArchiveSave} variant="outline" className="flex items-center gap-1" disabled={isLocked} title="아카이브에 저장">
              아카이브 저장
              <Archive className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default SelectedTopicCard;