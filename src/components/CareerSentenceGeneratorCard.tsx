
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CareerSentenceGeneratorCardProps {
  onGenerate: (data: {
    careerField: string;
    activity: string;
    file: File | null;
    aspiration: string;
  }) => void;
}

const CareerSentenceGeneratorCard: React.FC<CareerSentenceGeneratorCardProps> = ({
  onGenerate
}) => {
  const [careerField, setCareerField] = useState("");
  const [request, setRequest] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(Date.now());
  const [aspiration, setAspiration] = useState("");

  const handleClear = () => {
    setCareerField("");
    setRequest("");
    setFile(null);
    setAspiration("");
    setFileInputKey(Date.now());
  };

  const handleGenerateClick = () => {
    onGenerate({
      careerField,
      activity: request,
      file,
      aspiration
    });
  };

  const handleRequestChange = (value: string) => {
    setRequest(value);
    setFile(null);
    setAspiration("");
    if (value === '이전 활동이 존재합니다.') {
      setFileInputKey(Date.now());
    }
  };

  return <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>진로 문장 생성기</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between pt-0">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">직업</Button>
            <Input placeholder="예) 생명공학자" value={careerField} onChange={e => setCareerField(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
              요청 사항
            </Button>
            <Select value={request} onValueChange={handleRequestChange}>
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
          {request === '이전 활동이 존재합니다.' && (
            <div className="flex items-center gap-4">
                <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">학생부</Button>
                <Input
                    key={fileInputKey}
                    type="file"
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full"
                    aria-label="학생부 업로드" />
            </div>
          )}
          {request === '직업을 가진 후 하고 싶은 것이 있습니다.' && (
            <div className="flex items-start gap-4">
                <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0 mt-2">
                    추가 입력
                </Button>
                <Textarea
                    placeholder="직업을 가진 후 하고 싶은 것을 구체적으로 입력해주세요."
                    value={aspiration}
                    onChange={(e) => setAspiration(e.target.value)}
                    className="flex-grow min-h-[100px]" />
            </div>
          )}
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

