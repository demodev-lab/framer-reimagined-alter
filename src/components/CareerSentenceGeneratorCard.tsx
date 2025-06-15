
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";

interface CareerSentenceGeneratorCardProps {
  onGenerate: (data: {
    careerField: string;
    activity: string;
    realization: string;
  }) => void;
}

const CareerSentenceGeneratorCard: React.FC<CareerSentenceGeneratorCardProps> = ({ onGenerate }) => {
  const [careerField, setCareerField] = useState("");
  const [activity, setActivity] = useState("");
  const [realization, setRealization] = useState("");

  const handleClear = () => {
    setCareerField("");
    setActivity("");
    setRealization("");
  };

  const handleGenerateClick = () => {
    onGenerate({ careerField, activity, realization });
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>진로 문장 생성기</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-[110px] flex-shrink-0"
            >
              진로 분야
            </Button>
            <Input
              placeholder="예) 인공지능 전문가"
              value={careerField}
              onChange={(e) => setCareerField(e.target.value)}
            />
          </div>
          <div className="flex items-start gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-[110px] flex-shrink-0 mt-2"
            >
              활동 내용
            </Button>
            <Textarea
              placeholder="예) 교내 AI 동아리에서 '이미지 인식 모델 만들기' 프로젝트를 진행함."
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
          <div className="flex items-start gap-4">
            <Button
              variant="secondary"
              size="sm"
              className="w-[110px] flex-shrink-0 mt-2"
            >
              깨달은 점
            </Button>
            <Textarea
              placeholder="예) 모델의 정확도를 높이기 위해선 양질의 데이터셋 확보와 하이퍼파라미터 튜닝이 매우 중요하다는 것을 깨달음."
              value={realization}
              onChange={(e) => setRealization(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-6">
          <Button variant="ghost" onClick={handleClear}>
            지우기
          </Button>
          <Button onClick={handleGenerateClick}>문장 생성</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CareerSentenceGeneratorCard;
