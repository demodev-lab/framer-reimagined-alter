
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CareerSentenceGeneratorCardProps {
  onGenerate: (data: {
    careerField: string;
    activity: string;
    realization: string;
    problem: string;
    file: File | null;
  }) => void;
}

const CareerSentenceGeneratorCard: React.FC<CareerSentenceGeneratorCardProps> = ({
  onGenerate
}) => {
  const [careerField, setCareerField] = useState("");
  const [request, setRequest] = useState("");
  const [problem, setProblem] = useState("");
  const [realization, setRealization] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (request !== "이전 활동이 존재합니다.") {
      setFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
    }
  }, [request]);

  const handleClear = () => {
    setCareerField("");
    setRequest("");
    setProblem("");
    setRealization("");
    setFile(null);
    const fileInput = document.querySelector('#file-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleGenerateClick = () => {
    onGenerate({
      careerField,
      activity: request,
      realization,
      problem,
      file
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
            <Input placeholder="예) 생명공학자" value={careerField} onChange={e => setCareerField(e.target.value)} />
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
          {request === "이전 활동이 존재합니다." && (
            <div className="flex items-start gap-4">
               <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0 mt-2">
                파일 첨부
              </Button>
               <div className="w-full">
                <Input
                  id="file-upload"
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                />
                {file && (
                  <p className="text-sm text-muted-foreground mt-2">
                    선택된 파일: {file.name}
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
              해결할 문제
            </Button>
            <Select value={problem} onValueChange={setProblem}>
              <SelectTrigger>
                <SelectValue placeholder="해결할 문제를 선택하세요." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="유전성 희귀 질환의 비활성 유전자 문제">유전성 희귀 질환의 비활성 유전자 문제</SelectItem>
                <SelectItem value="플라스틱 폐기물로 인한 해양 오염">플라스틱 폐기물로 인한 해양 오염</SelectItem>
                <SelectItem value="기후 변화로 인한 식량 안보 위기">기후 변화로 인한 식량 안보 위기</SelectItem>
                <SelectItem value="고령화 사회의 돌봄 시스템 부재">고령화 사회의 돌봄 시스템 부재</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
              해결 방법
            </Button>
            <Select value={realization} onValueChange={setRealization}>
              <SelectTrigger>
                <SelectValue placeholder="해결 방법을 선택하세요." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="유전자 스위치 조절 기술">유전자 스위치 조절 기술</SelectItem>
                <SelectItem value="생분해성 플라스틱 개발">생분해성 플라스틱 개발</SelectItem>
                <SelectItem value="수직 농업 기술을 이용한 스마트팜">수직 농업 기술을 이용한 스마트팜</SelectItem>
                <SelectItem value="AI 기반 개인 맞춤형 돌봄 로봇">AI 기반 개인 맞춤형 돌봄 로봇</SelectItem>
              </SelectContent>
            </Select>
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
