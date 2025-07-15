
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { Button } from "./ui/button";
import { RefreshCw, Lock, X, ChevronDown, Archive, House, ExternalLink, ArrowLeft } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useArchive } from "@/contexts/ArchiveContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  onGenerateResearchMethod?: () => void;
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
  onGenerateResearchMethod
}) => {
  const { saveTopic } = useArchive();
  const navigate = useNavigate();

  const handleArchiveSave = () => {
    saveTopic({
      title: topic,
      subject,
      concept,
      topicType,
      researchMethods
    });
  };

  const handleGoToArchive = () => {
    navigate('/archive');
  };

  const handleGoBackToInput = () => {
    if (onGoBack) {
      onGoBack();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <Card className="flex-shrink-0">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleGoBackToInput} aria-label="주제 목록으로 돌아가기">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>주제 목록으로 돌아가기</p>
              </TooltipContent>
            </Tooltip>
            <CardTitle>세특 주제 {topicNumber}</CardTitle>
          </div>
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
          </div>
        </CardHeader>
        <CardContent className="overflow-hidden min-h-0 flex flex-col">
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
          
          {/* 보관함 저장 버튼과 탐구 방법 생성 버튼 */}
          <div className="flex justify-center gap-2 mt-4 pt-4 border-t">
            <Button onClick={handleArchiveSave} variant="outline" className="flex items-center gap-1" disabled={isLocked} title="보관함에 저장">
              보관함 저장
              <Archive className="h-4 w-4" />
            </Button>
            {onGenerateResearchMethod && (
              <Button onClick={async () => {
                toast.info('N8N에서 탐구 방법을 생성 중입니다...');
                try {
                  const response = await fetch('/webhook/protocol', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      topicName: topic,
                      timestamp: new Date().toISOString(),
                      source: 'selected-topic-card'
                    })
                  });
                  
                  if (response.ok) {
                    try {
                      const result = await response.json();
                      console.log('N8N 응답:', result);
                      
                      // N8N 응답 데이터를 직접 전달 (원본 객체 그대로)
                      let researchMethods = result;
                      
                      console.log('파싱된 탐구 방법들:', researchMethods);
                      
                      if (Array.isArray(researchMethods) && researchMethods.length > 0) {
                        // 실제 탐구 방법 데이터가 있을 때만 상태 업데이트
                        toast.success(`N8N에서 ${researchMethods.length}개의 탐구 방법을 받았습니다!`);
                        onGenerateResearchMethod(researchMethods);
                      } else if (researchMethods && typeof researchMethods === 'object') {
                        // 단일 객체인 경우 배열로 감싸서 전달
                        toast.success('N8N에서 탐구 방법을 받았습니다!');
                        onGenerateResearchMethod([researchMethods]);
                      } else {
                        console.log('N8N 응답에서 탐구 방법을 찾을 수 없음, 기본 로직 실행');
                        toast.info('기본 탐구 방법으로 생성합니다.');
                        onGenerateResearchMethod();
                      }
                    } catch (parseError) {
                      console.error('N8N 응답 파싱 오류:', parseError);
                      onGenerateResearchMethod();
                    }
                  } else {
                    console.error('웹훅 호출 실패:', response.statusText);
                    if (response.status === 504 || response.statusText.includes('Gateway Timeout')) {
                      toast.error('N8N 서버 응답 시간이 초과되었습니다. 탐구 방법 생성을 다시 눌러주세요.');
                    } else {
                      toast.error('탐구 방법 생성에 실패했습니다. 다시 시도해주세요.');
                    }
                  }
                } catch (error) {
                  console.error('웹훅 호출 중 오류:', error);
                  toast.error('N8N 연결에 문제가 있습니다. 탐구 방법 생성을 다시 눌러주세요.');
                }
              }} variant="outline" className="flex items-center gap-1" disabled={isLocked} title="탐구 방법 생성">
                탐구 방법 생성
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SelectedTopicCard;
