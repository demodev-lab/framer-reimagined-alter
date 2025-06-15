
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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
}

const TopicGeneratorCard = ({
  onGenerate,
  initialValues,
  showFollowUp,
  isFollowUp,
  onFollowUpChange,
  rowId,
}: TopicGeneratorCardProps) => {
  const [subject, setSubject] = useState(initialValues?.subject || "");
  const [concept, setConcept] = useState(initialValues?.concept || "");
  const [topicType, setTopicType] = useState(
    initialValues?.topicType || "보고서 주제"
  );
  const followUpId = `follow-up-${rowId}`;

  const handleClear = () => {
    setSubject("");
    setConcept("");
    setTopicType("보고서 주제");
    if (onFollowUpChange) {
      onFollowUpChange(false);
    }
  };

  const handleGenerateClick = () => {
    onGenerate({ subject, concept, topicType });
  };

  const isInputDisabled = isFollowUp;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>주제 생성기</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-[110px] flex-shrink-0"
              disabled={isInputDisabled}
            >
              교과 과목
            </Button>
            <Input
              placeholder="예) 화학, 생명과학"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={isInputDisabled}
            />
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-[110px] flex-shrink-0"
              disabled={isInputDisabled}
            >
              교과 개념
            </Button>
            <Input
              placeholder="예) 산화와 환원"
              value={concept}
              onChange={(e) => setConcept(e.target.value)}
              disabled={isInputDisabled}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center w-full gap-4">
                <div className="w-[110px] flex-shrink-0">
                    {showFollowUp ? (
                    <div className="flex items-center space-x-2">
                        <Checkbox id={followUpId} checked={isFollowUp} onCheckedChange={onFollowUpChange} />
                        <label
                        htmlFor={followUpId}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 whitespace-nowrap"
                        >
                        후속 탐구
                        </label>
                    </div>
                    ) : (
                    <Button variant="secondary" size="sm" className="w-full">
                        주제 유형
                    </Button>
                    )}
                </div>
                <Select onValueChange={setTopicType} value={topicType}>
                    <SelectTrigger className="w-full">
                    <SelectValue placeholder="주제 유형 선택" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="보고서 주제">보고서 주제</SelectItem>
                    <SelectItem value="실험 주제">실험 주제</SelectItem>
                    <SelectItem value="제작 주제">제작 주제</SelectItem>
                    </SelectContent>
                </Select>
            </div>
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
  );
};
export default TopicGeneratorCard;
