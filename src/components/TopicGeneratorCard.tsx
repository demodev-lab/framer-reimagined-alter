import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
const TopicGeneratorCard = () => {
  const [subject, setSubject] = useState("");
  const [concept, setConcept] = useState("");
  const [careerPath, setCareerPath] = useState("");
  const [request, setRequest] = useState("");
  const handleClear = () => {
    setSubject("");
    setConcept("");
    setCareerPath("");
    setRequest("");
  };
  return <Card className="flex flex-col py-0 my-0">
      <CardContent className="p-6 flex flex-col flex-grow justify-between py-0 my-[45px]">
        <div className="space-y-4 pt-4">
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
              진로
            </Button>
            <Input placeholder="예) 의사, 약사" value={careerPath} onChange={e => setCareerPath(e.target.value)} />
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="sm" className="w-[110px] flex-shrink-0">
              요청 사항
            </Button>
            <Input placeholder="(선택) 구체적인 요청 사항" value={request} onChange={e => setRequest(e.target.value)} />
          </div>
        </div>
        <div className="flex justify-end gap-2 py-[10px]">
          <Button variant="ghost" onClick={handleClear}>
            지우기
          </Button>
          <Button>주제 생성</Button>
        </div>
      </CardContent>
    </Card>;
};
export default TopicGeneratorCard;