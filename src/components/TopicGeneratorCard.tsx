import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Toggle } from "@/components/ui/toggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { X } from "lucide-react";
import CareerSentenceGeneratorCard from "./CareerSentenceGeneratorCard";
import { useArchive } from "@/contexts/ArchiveContext";
interface TopicGeneratorCardProps {
  onGenerate: (data: {
    subject: string;
    concept: string;
    topicType: string;
  }) => void;
  initialValues?: {
    subject: string;
    concept: string;
    request: string;
    topicType: string;
  };
  showFollowUp?: boolean;
  isFollowUp?: boolean;
  onFollowUpChange?: (checked: boolean | 'indeterminate') => void;
  rowId: number;
  selectedCareerSentence?: string | null;
  onCareerSentenceSelect?: (sentence: string) => void;
  onGoBack?: () => void;
}
const TopicGeneratorCard = ({
  onGenerate,
  initialValues,
  showFollowUp,
  isFollowUp,
  onFollowUpChange,
  rowId,
  selectedCareerSentence,
  onCareerSentenceSelect,
  onGoBack
}: TopicGeneratorCardProps) => {
  const [subject, setSubject] = useState(initialValues?.subject || "");
  const [concept, setConcept] = useState(initialValues?.concept || "");
  const [topicType, setTopicType] = useState(initialValues?.topicType || "보고서 주제");
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [generatedCareerSentences, setGeneratedCareerSentences] = useState<string[]>([]);
  const [isGeneratingCareerSentence, setIsGeneratingCareerSentence] = useState(false);
  const [selectedFollowUpTopic, setSelectedFollowUpTopic] = useState<string>("");
  const {
    archivedTopics
  } = useArchive();
  const handleClear = () => {
    setSubject("");
    setConcept("");
    setTopicType("보고서 주제");
    setSelectedFollowUpTopic("");
    if (onFollowUpChange) {
      onFollowUpChange(false);
    }
  };
  const handleGoBack = () => {
    if (onGoBack) {
      onGoBack();
    }
  };
  const handleGenerateClick = () => {
    if (!selectedCareerSentence) {
      setShowVideoDialog(true);
      return;
    }
    onGenerate({
      subject,
      concept,
      topicType
    });
  };
  const handleCloseDialog = () => {
    setShowVideoDialog(false);
  };
  const handleCareerSentenceGenerate = (data: {
    careerField: string;
    activity: string;
    file: File | null;
    aspiration: string;
  }) => {
    console.log("Career sentence generated:", data);
    setIsGeneratingCareerSentence(true);

    // 시뮬레이션: 3개의 진로 문장 생성
    setTimeout(() => {
      const sentences = [`${data.careerField}이 되어 ${data.activity}을 통해 사회에 기여하고 싶습니다.`, `${data.careerField}으로서 ${data.activity} 분야에서 전문성을 발휘하고 싶습니다.`, `${data.careerField}의 꿈을 이루기 위해 ${data.activity}을 깊이 탐구하고 싶습니다.`];
      setGeneratedCareerSentences(sentences);
      setIsGeneratingCareerSentence(false);
    }, 2000);
  };
  const handleSelectCareerSentence = (sentence: string) => {
    setShowVideoDialog(false);
    // 상위 컴포넌트에 선택된 진로 문장 전달
    if (onCareerSentenceSelect) {
      onCareerSentenceSelect(sentence);
    }
  };
  return <>
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle className="text-center">주제 생성기</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow justify-between pt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
                교과 과목
              </Button>
              <Input placeholder="예) 화학, 생명과학" value={subject} onChange={e => setSubject(e.target.value)} />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
                교과 개념
              </Button>
              <Input placeholder="예) 산화와 환원" value={concept} onChange={e => setConcept(e.target.value)} />
            </div>
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
                주제 유형
              </Button>
              <Select value={topicType} onValueChange={setTopicType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="보고서 주제">보고서 주제</SelectItem>
                  <SelectItem value="실험 주제">실험 주제</SelectItem>
                  <SelectItem value="탐구 주제">탐구 주제</SelectItem>
                  <SelectItem value="프로젝트 주제">프로젝트 주제</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-[110px] flex-shrink-0">
                {showFollowUp ? <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Toggle pressed={isFollowUp} onPressedChange={pressed => onFollowUpChange && onFollowUpChange(pressed)} variant="outline" size="sm" className="w-full whitespace-nowrap data-[state=on]:bg-foreground data-[state=on]:text-background" aria-label="후속 탐구">
                          후속 탐구
                        </Toggle>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>후속 탐구를 만들고 싶다면, 클릭하세요</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider> : <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>돌아가기</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>}
              </div>
            </div>
            
            {/* 후속 탐구 선택 섹션 */}
            <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
                후속 탐구
              </Button>
              <Select onValueChange={setSelectedFollowUpTopic} value={selectedFollowUpTopic}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={archivedTopics.length === 0 ? "아직 주제가 없습니다" : "아카이브된 주제를 선택하세요"} />
                </SelectTrigger>
                <SelectContent>
                  {archivedTopics.length > 0 && archivedTopics.map(topic => <SelectItem key={topic.id} value={topic.id}>
                        {topic.title}
                      </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-6">
            <Button variant="ghost" onClick={handleClear}>
              지우기
            </Button>
            <Button onClick={handleGenerateClick}>주제 생성</Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showVideoDialog} onOpenChange={setShowVideoDialog}>
        <DialogContent className="max-w-6xl w-full p-0 bg-white">
          <DialogClose className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none" onClick={handleCloseDialog}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              진로 문장을 먼저 생성해주세요
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              주제를 생성하기 위해서는 진로 문장이 필요합니다. 아래에서 진로 문장을 생성해주세요.
            </p>
            
            {/* 좌우 분할 레이아웃 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
              {/* 왼쪽: 진로 문장 생성기 */}
              <div className="h-full">
                <CareerSentenceGeneratorCard onGenerate={handleCareerSentenceGenerate} />
              </div>
              
              {/* 오른쪽: 생성된 진로 문장 결과 */}
              <div className="h-full">
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>생성된 진로 문장</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow overflow-hidden min-h-0">
                    {isGeneratingCareerSentence ? <div className="flex items-center justify-center h-full">
                        <p>진로 문장을 생성 중입니다...</p>
                      </div> : generatedCareerSentences.length === 0 ? <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground text-center">
                          '문장 생성' 버튼을 누르면 진로 문장 후보 3개가 생성됩니다.
                        </p>
                      </div> : <div className="flex flex-col gap-2 h-full overflow-y-auto">
                        {generatedCareerSentences.map((sentence, index) => <Button key={index} variant="outline" className="justify-start text-left h-auto whitespace-normal py-3 px-4 hover:bg-green-50 hover:border-green-300" onClick={() => handleSelectCareerSentence(sentence)}>
                            {sentence}
                          </Button>)}
                      </div>}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};
export default TopicGeneratorCard;