
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CareerSentenceGeneratorCardProps {
  onGenerate: (data: {
    careerField: string;
    activity: string;
    realization: string;
  }) => void;
}

const CareerSentenceGeneratorCard: React.FC<CareerSentenceGeneratorCardProps> = ({
  onGenerate
}) => {
  const [careerField, setCareerField] = useState("");
  const [request, setRequest] = useState("");
  const [realization, setRealization] = useState("");

  const handleClear = () => {
    setCareerField("");
    setRequest("");
    setRealization("");
  };

  const handleGenerateClick = () => {
    onGenerate({
      careerField,
      activity: request,
      realization
    });
  };

  return <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>진로 문장 생성기</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">직업</Button>
            <Input placeholder="예) 인공지능 전문가" value={careerField} onChange={e => setCareerField(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
              요청 사항
            </Button>
            <Select value={request} onValueChange={setRequest}>
              <SelectTrigger>
                <SelectValue placeholder="요청 사항을 선택하세요." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="이전 활동이 존재합니다.">이전 활동이 존재합니다.</SelectItem>
                <SelectItem value="직업을 가진 후 하고 싶은 것이 있습니다.">직업을 가진 후 하고 싶은 것이 있습니다.</SelectItem>
                <SelectItem value="요청 사항 없음.">요청 사항 없음.</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-start gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0 mt-2">
              깨달은 점
            </Button>
            <Textarea placeholder="예) 모델의 정확도를 높이기 위해선 양질의 데이터셋 확보와 하이퍼파라미터 튜닝이 매우 중요하다는 것을 깨달음." value={realization} onChange={e => setRealization(e.target.value)} className="min-h-[80px]" />
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-6">
          <Button variant="ghost" onClick={handleClear}>
            지우기
          </Button>
          <Button onClick={handleGenerateClick}>문장 생성</Button>
        </div>
      </CardContent>
    </Card>;
};
export default CareerSentenceGeneratorCard;
