import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Button } from "./ui/button";
import {
  RefreshCw,
  Lock,
  X,
  ChevronDown,
  ChevronRight,
  Archive,
  House,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
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
import { useArchive } from "@/contexts/ArchiveContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { n8nPollingClient } from "@/utils/n8nPollingClient";
import { useRef } from "react";

interface SelectedTopicCardProps {
  topic: string | null;
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
  onGoBackToInput?: () => void;
  onGenerateResearchMethod?: (methods?: string[]) => void;
  topicSummary?: string | null;
  isLoadingTopics?: boolean;
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
  onGoBack,
  onGoBackToInput,
  onGenerateResearchMethod,
  topicSummary,
  isLoadingTopics = false,
}) => {
  const { saveTopic } = useArchive();
  const navigate = useNavigate();
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleArchiveSave = () => {
    saveTopic({
      title: topic,
      subject,
      concept,
      topicType,
      researchMethods,
    });
  };

  const handleGoToArchive = () => {
    navigate("/archive");
  };

  const handleGoBackToInput = () => {
    if (onGoBackToInput) {
      onGoBackToInput();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <Card className="flex-shrink-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle>세특 주제</CardTitle>
          </div>
          <div className="flex gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleGoBackToInput}
                  aria-label="주제 입력으로 돌아가기"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>주제 입력으로 돌아가기</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onRefresh}
                  aria-label="주제 재생성"
                  disabled={isLocked}
                >
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>새로운 주제 생성</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLock}
                  aria-label={isLocked ? "주제 잠금 해제" : "주제 잠금"}
                >
                  <Lock
                    className={`h-4 w-4 ${isLocked ? "text-primary" : ""}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isLocked ? "주제 잠금 해제" : "주제 잠금"}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden min-h-0 flex flex-col">
          {isLoadingTopics ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-12">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p>탐구 주제 생성 중</p>
            </div>
          ) : (
            <div>
              <p className="text-lg font-semibold">{topic || '주제를 생성 중입니다...'}</p>
              <div className="border-t my-4" />
              <dl className="space-y-2">
                {subject && (
                  <div className="flex">
                    <dt className="w-20 font-semibold text-muted-foreground shrink-0">
                      교과 과목
                    </dt>
                    <dd className="font-medium">{subject}</dd>
                  </div>
                )}
                {concept && (
                  <div className="flex">
                    <dt className="w-20 font-semibold text-muted-foreground shrink-0">
                      교과 개념
                    </dt>
                    <dd className="font-medium">{concept}</dd>
                  </div>
                )}
                <div className="flex">
                  <dt className="w-20 font-semibold text-muted-foreground shrink-0">
                    주제 유형
                  </dt>
                  <dd className="font-medium">{topicType}</dd>
                </div>
                {topicSummary && (
                  <div className="flex">
                    <dt className="w-20 font-semibold text-muted-foreground shrink-0">
                      주제 개요
                    </dt>
                    <dd className="font-medium leading-relaxed">{topicSummary}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* 탐구 방법 생성 버튼과 보관함 저장 버튼 */}
          {!isLoadingTopics && (
            <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
              {onGenerateResearchMethod && (
              <Button
                onClick={async () => {
                  // 버튼 클릭 즉시 탐구 방법 섹션 표시
                  if (onGenerateResearchMethod) {
                    onGenerateResearchMethod();
                  }
                  
                  toast.info("탐구 방법을 생성 중입니다...");
                  
                  // 이전 요청이 진행 중이면 취소
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                  }
                  
                  // 새로운 AbortController 생성
                  abortControllerRef.current = new AbortController();
                  
                  try {
                    const response = await n8nPollingClient.requestResearchMethods(
                      {
                        topicName: topic,
                        timestamp: new Date().toISOString(),
                        source: "selected-topic-card",
                      },
                      abortControllerRef.current.signal
                    );

                    if (response.success && response.data) {
                      console.log("N8N 응답:", response.data);

                      // N8N 응답 데이터를 직접 전달 (원본 객체 그대로)
                      const researchMethods = response.data;

                      console.log("파싱된 탐구 방법들:", researchMethods);

                      if (
                        Array.isArray(researchMethods) &&
                        researchMethods.length > 0
                      ) {
                        // 실제 탐구 방법 데이터가 있을 때만 상태 업데이트
                        toast.success(
                          `${researchMethods.length}개의 탐구 방법을 생성했습니다!`
                        );
                        onGenerateResearchMethod(researchMethods);
                      } else if (
                        researchMethods &&
                        typeof researchMethods === "object"
                      ) {
                        // 단일 객체인 경우 배열로 감싸서 전달
                        toast.success("탐구 방법을 생성했습니다!");
                        onGenerateResearchMethod([researchMethods]);
                      } else {
                        console.log(
                          "N8N 응답에서 탐구 방법을 찾을 수 없음, 기본 로직 실행"
                        );
                        toast.info("기본 탐구 방법으로 생성합니다.");
                        onGenerateResearchMethod();
                      }
                    } else {
                      console.error("탐구 방법 생성 실패:", response.error);
                      
                      if (response.status === 'timeout') {
                        toast.error(
                          "서버 응답 시간이 초과되었습니다. 탐구 방법 생성을 다시 눌러주세요."
                        );
                      } else if (response.status === 'cancelled') {
                        toast.info("요청이 취소되었습니다.");
                      } else {
                        toast.error(
                          "탐구 방법 생성에 실패했습니다. 다시 시도해주세요."
                        );
                      }
                    }
                  } catch (error) {
                    console.error("탐구 방법 요청 중 오류:", error);
                    
                    if (error.name === 'AbortError') {
                      toast.info("요청이 취소되었습니다.");
                    } else {
                      toast.error(
                        "연결에 문제가 있습니다. 탐구 방법 생성을 다시 눌러주세요."
                      );
                    }
                  }
                }}
                variant="outline"
                className="flex items-center gap-1"
                disabled={isLocked}
                title="탐구 방법 생성"
              >
                탐구 방법 생성
              </Button>
            )}
            <Button
              onClick={handleArchiveSave}
              variant="outline"
              className="flex items-center gap-1"
              disabled={isLocked}
              title="보관함에 저장"
            >
              보관함 저장
              <Archive className="h-4 w-4" />
            </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectedTopicCard;
